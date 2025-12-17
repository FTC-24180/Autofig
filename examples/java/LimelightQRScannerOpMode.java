package org.firstinspires.ftc.teamcode.auto;

import com.qualcomm.hardware.limelightvision.LLResult;
import com.qualcomm.hardware.limelightvision.LLResultTypes;
import com.qualcomm.hardware.limelightvision.Limelight3A;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;

import org.firstinspires.ftc.teamcode.auto.config.AutoConfigParser;
import org.firstinspires.ftc.teamcode.auto.config.MatchDataConfig;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * OpMode that uses goBILDA Limelight 3A to scan QR codes containing match data
 * and saves a unified JSON file to the robot controller.
 * 
 * Instructions:
 * 1. Configure Limelight 3A for barcode/QR code detection
 * 2. Run this OpMode
 * 3. Point camera at QR codes containing match data
 * 4. Press A to scan current QR code
 * 5. Press B to finalize and save all scanned matches
 * 6. Saved file: /sdcard/FIRST/match-data.json
 * 
 * QR Code Format:
 * QR codes should contain complete match data JSON in the AutoConfig schema format.
 * Each QR code can contain one or more matches.
 * 
 * State-based design - no blocking sleeps, fully responsive to input
 */
@TeleOp(name = "Limelight QR Scanner", group = "Config")
public class LimelightQRScannerOpMode extends LinearOpMode {
    
    // Hardware
    private Limelight3A limelight;
    
    // Configuration
    private static final String LIMELIGHT_NAME = "limelight";
    private static final String OUTPUT_FILE = "/sdcard/FIRST/match-data.json";
    private static final String SCHEMA_VERSION = "1.0.0";
    
    // State management
    private enum OpModeState {
        READY,              // Ready for input
        SCANNING,           // Currently scanning QR code
        SHOWING_MESSAGE,    // Displaying message (error or success)
        PREVIEWING,         // Showing QR code preview
        SAVED               // Successfully saved, waiting for stop
    }
    
    private OpModeState currentState = OpModeState.READY;
    private String statusMessage = "";
    private String statusDetail = "";
    
    // Data storage
    private List<MatchDataConfig> scannedConfigs = new ArrayList<>();
    private AutoConfigParser parser = new AutoConfigParser();
    
    @Override
    public void runOpMode() throws InterruptedException {
        telemetry.addData("Status", "Initializing Limelight...");
        telemetry.update();
        
        // Initialize Limelight
        if (!initializeLimelight()) {
            waitForStart();
            return;
        }
        
        displayInitialInstructions();
        waitForStart();
        
        if (!opModeIsActive()) return;
        
        // Main loop - non-blocking, state-based
        while (opModeIsActive()) {
            handleState();
            updateTelemetry();
            idle(); // Yield to allow other processes
        }
        
        // Cleanup
        if (limelight != null) {
            limelight.stop();
        }
    }
    
    /**
     * Initialize Limelight hardware
     * @return true if successful, false on error
     */
    private boolean initializeLimelight() {
        try {
            limelight = hardwareMap.get(Limelight3A.class, LIMELIGHT_NAME);
            limelight.pipelineSwitch(0);
            limelight.start();
            telemetry.addData("Limelight", "Initialized");
            telemetry.update();
            return true;
        } catch (Exception e) {
            telemetry.clear();
            telemetry.addData("Error", "Failed to initialize Limelight");
            telemetry.addData("Message", e.getMessage());
            telemetry.addData("Check", "Hardware config name: " + LIMELIGHT_NAME);
            telemetry.update();
            return false;
        }
    }
    
    /**
     * Display initial instructions before start
     */
    private void displayInitialInstructions() {
        telemetry.clear();
        telemetry.addData("Status", "Ready to scan");
        telemetry.addData("Controls", "");
        telemetry.addData("> A Button", "Scan QR code");
        telemetry.addData("> B Button", "Save & finish");
        telemetry.addData("> X Button", "Clear all scans");
        telemetry.addData("> Y Button", "Preview current QR");
        telemetry.addLine();
        telemetry.addData("Scanned Matches", scannedConfigs.size());
        telemetry.addData("Output", OUTPUT_FILE);
        telemetry.update();
    }
    
    /**
     * Main state handler - dispatches to appropriate handler based on state
     */
    private void handleState() {
        switch (currentState) {
            case READY:
                handleReadyState();
                break;
                
            case SCANNING:
                handleScanningState();
                break;
                
            case SHOWING_MESSAGE:
                handleShowingMessageState();
                break;
                
            case PREVIEWING:
                handlePreviewingState();
                break;
                
            case SAVED:
                handleSavedState();
                break;
        }
    }
    
    /**
     * Handle READY state - waiting for user input
     */
    private void handleReadyState() {
        // Use SDK's {button}WasPressed() for edge detection - automatically handles press/release
        if (gamepad1.aWasPressed()) {
            startScanQRCode();
        } else if (gamepad1.bWasPressed()) {
            startSaveAndFinish();
        } else if (gamepad1.xWasPressed()) {
            clearScans();
        } else if (gamepad1.yWasPressed()) {
            startPreviewQRCode();
        }
    }
    
    /**
     * Handle SCANNING state - perform scan operation
     */
    private void handleScanningState() {
        try {
            LLResult result = limelight.getLatestResult();
            
            if (result == null || !result.isValid()) {
                showMessage("Error: No Limelight result", 
                           "Check camera connection");
                return;
            }
            
            List<LLResultTypes.BarcodeResult> barcodes = result.getBarcodeResults();
            
            if (barcodes == null || barcodes.isEmpty()) {
                showMessage("Error: No QR codes detected", 
                           "Point camera at QR code");
                return;
            }
            
            LLResultTypes.BarcodeResult barcode = barcodes.get(0);
            String qrData = barcode.getData();
            
            if (qrData == null || qrData.isEmpty()) {
                showMessage("Error: QR code is empty", "");
                return;
            }
            
            // Parse JSON from QR code
            try {
                MatchDataConfig config = parser.parseJson(qrData);
                
                if (config == null || config.matches == null || config.matches.isEmpty()) {
                    showMessage("Error: No matches in QR code", 
                               "Check QR code format");
                    return;
                }
                
                // Success - add to scanned configs
                scannedConfigs.add(config);
                showMessage("Success!", 
                           "Scanned " + config.matches.size() + " match(es). " +
                           "Total: " + getTotalMatchCount());
                
            } catch (Exception e) {
                showMessage("Parse Error: " + e.getMessage(), 
                           "QR Preview: " + qrData.substring(0, Math.min(100, qrData.length())));
            }
            
        } catch (Exception e) {
            showMessage("Scan Error: " + e.getMessage(), "");
        }
    }
    
    /**
     * Handle SHOWING_MESSAGE state - display message until user presses any button
     */
    private void handleShowingMessageState() {
        // Any button press returns to ready state
        if (gamepad1.aWasPressed() || 
            gamepad1.bWasPressed() || 
            gamepad1.xWasPressed() || 
            gamepad1.yWasPressed()) {
            currentState = OpModeState.READY;
            statusMessage = "";
            statusDetail = "";
        }
    }
    
    /**
     * Handle PREVIEWING state - show QR preview until user presses button
     */
    private void handlePreviewingState() {
        // Any button press returns to ready state
        if (gamepad1.aWasPressed() || 
            gamepad1.bWasPressed() || 
            gamepad1.xWasPressed() || 
            gamepad1.yWasPressed()) {
            currentState = OpModeState.READY;
            statusMessage = "";
            statusDetail = "";
        }
    }
    
    /**
     * Handle SAVED state - file saved, waiting for stop
     */
    private void handleSavedState() {
        // Just wait for user to stop the OpMode
        // All telemetry is already set
    }
    
    /**
     * Start scanning QR code
     */
    private void startScanQRCode() {
        currentState = OpModeState.SCANNING;
        statusMessage = "Scanning QR code...";
        statusDetail = "";
    }
    
    /**
     * Start preview of QR code
     */
    private void startPreviewQRCode() {
        try {
            LLResult result = limelight.getLatestResult();
            
            if (result == null || !result.isValid()) {
                showMessage("Error: No Limelight result", "");
                return;
            }
            
            List<LLResultTypes.BarcodeResult> barcodes = result.getBarcodeResults();
            
            if (barcodes == null || barcodes.isEmpty()) {
                showMessage("Error: No QR codes detected", "");
                return;
            }
            
            LLResultTypes.BarcodeResult barcode = barcodes.get(0);
            String qrData = barcode.getData();
            
            // Set preview state
            currentState = OpModeState.PREVIEWING;
            statusMessage = "QR Code Preview (Press any button to exit)";
            statusDetail = "Type: " + barcode.getType() + "\n" +
                          "Length: " + qrData.length() + " characters\n\n" +
                          "Data: " + qrData.substring(0, Math.min(200, qrData.length())) +
                          (qrData.length() > 200 ? "\n... (" + (qrData.length() - 200) + " more chars)" : "");
            
        } catch (Exception e) {
            showMessage("Preview Error: " + e.getMessage(), "");
        }
    }
    
    /**
     * Clear all scanned data
     */
    private void clearScans() {
        scannedConfigs.clear();
        showMessage("Cleared all scans", "Ready to scan again");
    }
    
    /**
     * Start save and finish process
     */
    private void startSaveAndFinish() {
        if (scannedConfigs.isEmpty()) {
            showMessage("Error: No matches to save", 
                       "Scan at least one QR code first");
            return;
        }
        
        try {
            // Merge all scanned configs
            MatchDataConfig unified = mergeConfigs(scannedConfigs);
            
            // Get list of match numbers
            List<Integer> matchNumbers = new ArrayList<>();
            for (org.firstinspires.ftc.teamcode.auto.config.MatchWrapper wrapper : unified.matches) {
                if (wrapper.match != null) {
                    matchNumbers.add(wrapper.match.number);
                }
            }
            java.util.Collections.sort(matchNumbers);
            
            // Convert to JSON
            String json = configToJson(unified);
            
            // Ensure directory exists
            File outputFile = new File(OUTPUT_FILE);
            File parentDir = outputFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }
            
            // Write to file
            try (FileWriter writer = new FileWriter(outputFile)) {
                writer.write(json);
            }
            
            // Success - enter saved state
            currentState = OpModeState.SAVED;
            statusMessage = "SUCCESS!";
            statusDetail = "Saved: " + unified.matches.size() + " match(es)\n" +
                          "Match Numbers: " + matchNumbers.toString() + "\n" +
                          "File: " + OUTPUT_FILE + "\n\n" +
                          "Note: Duplicate match numbers overwritten\n" +
                          "Ready for autonomous!\n\n" +
                          "Press STOP to exit";
            
        } catch (IOException e) {
            showMessage("SAVE ERROR: " + e.getMessage(), 
                       "Path: " + OUTPUT_FILE + "\n\n" +
                       "Press B to retry");
        } catch (Exception e) {
            showMessage("ERROR: " + e.getMessage(), "");
        }
    }
    
    /**
     * Show a message and transition to SHOWING_MESSAGE state
     */
    private void showMessage(String message, String detail) {
        currentState = OpModeState.SHOWING_MESSAGE;
        statusMessage = message;
        statusDetail = detail;
    }
    
    /**
     * Update telemetry based on current state
     */
    private void updateTelemetry() {
        telemetry.clear();
        
        // Display based on current state
        switch (currentState) {
            case READY:
                displayReadyTelemetry();
                break;
                
            case SCANNING:
                displayScanningTelemetry();
                break;
                
            case SHOWING_MESSAGE:
            case PREVIEWING:
            case SAVED:
                displayMessageTelemetry();
                break;
        }
        
        telemetry.update();
    }
    
    /**
     * Display telemetry for READY state
     */
    private void displayReadyTelemetry() {
        telemetry.addData("Status", "Ready");
        telemetry.addLine();
        
        // Show Limelight status
        LLResult result = limelight.getLatestResult();
        if (result != null && result.isValid()) {
            telemetry.addData("Limelight", "Target detected");
            
            List<LLResultTypes.BarcodeResult> barcodes = result.getBarcodeResults();
            if (barcodes != null && !barcodes.isEmpty()) {
                telemetry.addData("QR Codes", barcodes.size() + " detected");
                telemetry.addData("", "Press A to scan");
            } else {
                telemetry.addData("QR Codes", "None detected");
            }
        } else {
            telemetry.addData("Limelight", "No target");
        }
        
        telemetry.addLine();
        telemetry.addData("Scanned Matches", getTotalMatchCount());
        telemetry.addData("Scans", scannedConfigs.size());
        
        telemetry.addLine();
        telemetry.addData("Controls", "");
        telemetry.addData("> A", "Scan QR code");
        telemetry.addData("> B", "Save & finish");
        telemetry.addData("> X", "Clear all");
        telemetry.addData("> Y", "Preview QR");
    }
    
    /**
     * Display telemetry for SCANNING state
     */
    private void displayScanningTelemetry() {
        telemetry.addData("Status", "SCANNING...");
        telemetry.addData("", "Please wait");
    }
    
    /**
     * Display telemetry for message/preview/saved states
     */
    private void displayMessageTelemetry() {
        telemetry.addData("Status", statusMessage);
        
        if (!statusDetail.isEmpty()) {
            telemetry.addLine();
            // Split detail into lines for better display
            String[] lines = statusDetail.split("\n");
            for (String line : lines) {
                if (line.isEmpty()) {
                    telemetry.addLine();
                } else {
                    telemetry.addData("", line);
                }
            }
        }
        
        if (currentState == OpModeState.SHOWING_MESSAGE || 
            currentState == OpModeState.PREVIEWING) {
            telemetry.addLine();
            telemetry.addData("", "Press any button to continue");
        }
    }
    
    /**
     * Merge multiple configs into a single unified config
     * Match number is the primary key - newer scans overwrite existing matches with same number
     * Matches are ordered by match number
     */
    private MatchDataConfig mergeConfigs(List<MatchDataConfig> configs) {
        MatchDataConfig unified = new MatchDataConfig();
        unified.version = SCHEMA_VERSION;
        unified.matches = new ArrayList<>();
        
        // Use TreeMap to automatically sort by match number
        java.util.Map<Integer, org.firstinspires.ftc.teamcode.auto.config.MatchWrapper> matchMap = 
            new java.util.TreeMap<>();
        
        // Process configs in order - later configs overwrite earlier ones
        for (MatchDataConfig config : configs) {
            if (config.matches != null) {
                for (org.firstinspires.ftc.teamcode.auto.config.MatchWrapper wrapper : config.matches) {
                    if (wrapper.match != null) {
                        int matchNumber = wrapper.match.number;
                        matchMap.put(matchNumber, wrapper);
                    }
                }
            }
        }
        
        // Convert map back to list (sorted by match number)
        unified.matches.addAll(matchMap.values());
        
        return unified;
    }
    
    /**
     * Convert config to formatted JSON string
     */
    private String configToJson(MatchDataConfig config) {
        com.google.gson.Gson gson = new com.google.gson.GsonBuilder()
            .setPrettyPrinting()
            .create();
        
        return gson.toJson(config);
    }
    
    /**
     * Get total number of matches across all scanned configs
     */
    private int getTotalMatchCount() {
        int count = 0;
        for (MatchDataConfig config : scannedConfigs) {
            if (config.matches != null) {
                count += config.matches.size();
            }
        }
        return count;
    }
}
