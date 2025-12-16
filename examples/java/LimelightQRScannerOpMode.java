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
 */
@TeleOp(name = "Limelight QR Scanner", group = "Config")
public class LimelightQRScannerOpMode extends LinearOpMode {
    
    // Hardware
    private Limelight3A limelight;
    
    // Configuration
    private static final String LIMELIGHT_NAME = "limelight";  // Update to match your hardware config
    private static final String OUTPUT_FILE = "/sdcard/FIRST/match-data.json";
    private static final String SCHEMA_VERSION = "1.0.0";
    
    // State
    private List<MatchDataConfig> scannedConfigs = new ArrayList<>();
    private AutoConfigParser parser = new AutoConfigParser();
    private boolean isScanning = false;
    
    @Override
    public void runOpMode() throws InterruptedException {
        telemetry.addData("Status", "Initializing Limelight...");
        telemetry.update();
        
        // Initialize Limelight
        try {
            limelight = hardwareMap.get(Limelight3A.class, LIMELIGHT_NAME);
            limelight.pipelineSwitch(0);  // Use pipeline 0 - configure for barcode detection
            limelight.start();
            telemetry.addData("Limelight", "Initialized");
        } catch (Exception e) {
            telemetry.addData("Error", "Failed to initialize Limelight");
            telemetry.addData("Message", e.getMessage());
            telemetry.addData("Check", "Hardware config name: " + LIMELIGHT_NAME);
            telemetry.update();
            
            waitForStart();
            return;
        }
        
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
        
        waitForStart();
        
        if (!opModeIsActive()) return;
        
        // Main scanning loop
        while (opModeIsActive()) {
            // Update telemetry with current state
            updateTelemetry();
            
            // Handle button inputs
            handleControls();
            
            sleep(50);  // Small delay to prevent button spam
        }
        
        // Cleanup
        if (limelight != null) {
            limelight.stop();
        }
    }
    
    /**
     * Update telemetry display
     */
    private void updateTelemetry() {
        telemetry.clear();
        telemetry.addData("Status", isScanning ? "SCANNING..." : "Ready");
        telemetry.addLine();
        
        // Show Limelight status
        LLResult result = limelight.getLatestResult();
        if (result != null && result.isValid()) {
            telemetry.addData("Limelight", "Target detected");
            
            // Check for barcode/QR results
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
        
        telemetry.update();
    }
    
    /**
     * Handle gamepad controls
     */
    private void handleControls() {
        // A button: Scan current QR code
        if (gamepad1.a && !isScanning) {
            scanQRCode();
        }
        
        // B button: Save and finish
        if (gamepad1.b && !isScanning) {
            saveAndFinish();
        }
        
        // X button: Clear all scans
        if (gamepad1.x && !isScanning) {
            clearScans();
        }
        
        // Y button: Preview current QR
        if (gamepad1.y && !isScanning) {
            previewQRCode();
        }
    }
    
    /**
     * Scan QR code from Limelight
     */
    private void scanQRCode() {
        isScanning = true;
        telemetry.addData("Action", "Scanning QR code...");
        telemetry.update();
        
        try {
            LLResult result = limelight.getLatestResult();
            
            if (result == null || !result.isValid()) {
                telemetry.addData("Error", "No Limelight result");
                telemetry.update();
                sleep(1500);
                isScanning = false;
                return;
            }
            
            // Get barcode results
            List<LLResultTypes.BarcodeResult> barcodes = result.getBarcodeResults();
            
            if (barcodes == null || barcodes.isEmpty()) {
                telemetry.addData("Error", "No QR codes detected");
                telemetry.addData("", "Point camera at QR code");
                telemetry.update();
                sleep(1500);
                isScanning = false;
                return;
            }
            
            // Process first barcode (or could process all)
            LLResultTypes.BarcodeResult barcode = barcodes.get(0);
            String qrData = barcode.getData();
            
            if (qrData == null || qrData.isEmpty()) {
                telemetry.addData("Error", "QR code is empty");
                telemetry.update();
                sleep(1500);
                isScanning = false;
                return;
            }
            
            telemetry.addData("QR Data Length", qrData.length() + " chars");
            telemetry.update();
            
            // Parse JSON from QR code
            try {
                MatchDataConfig config = parser.parseJson(qrData);
                
                if (config == null || config.matches == null || config.matches.isEmpty()) {
                    telemetry.addData("Error", "No matches in QR code");
                    telemetry.update();
                    sleep(1500);
                    isScanning = false;
                    return;
                }
                
                // Add to scanned configs
                scannedConfigs.add(config);
                
                telemetry.addData("Success!", "Scanned " + config.matches.size() + " match(es)");
                telemetry.addData("Total Matches", getTotalMatchCount());
                telemetry.update();
                sleep(1500);
                
            } catch (Exception e) {
                telemetry.addData("Parse Error", e.getMessage());
                telemetry.addData("QR Preview", qrData.substring(0, Math.min(100, qrData.length())));
                telemetry.update();
                sleep(2000);
            }
            
        } catch (Exception e) {
            telemetry.addData("Scan Error", e.getMessage());
            telemetry.update();
            sleep(2000);
        } finally {
            isScanning = false;
        }
    }
    
    /**
     * Preview QR code data without saving
     */
    private void previewQRCode() {
        telemetry.clear();
        telemetry.addData("Action", "Previewing QR code...");
        telemetry.update();
        sleep(500);
        
        try {
            LLResult result = limelight.getLatestResult();
            
            if (result == null || !result.isValid()) {
                telemetry.addData("Error", "No Limelight result");
                telemetry.update();
                sleep(1500);
                return;
            }
            
            List<LLResultTypes.BarcodeResult> barcodes = result.getBarcodeResults();
            
            if (barcodes == null || barcodes.isEmpty()) {
                telemetry.addData("Error", "No QR codes detected");
                telemetry.update();
                sleep(1500);
                return;
            }
            
            LLResultTypes.BarcodeResult barcode = barcodes.get(0);
            String qrData = barcode.getData();
            
            telemetry.clear();
            telemetry.addData("QR Code Preview", "");
            telemetry.addData("Type", barcode.getType());
            telemetry.addData("Length", qrData.length() + " characters");
            telemetry.addLine();
            
            // Show first 200 characters
            int previewLength = Math.min(200, qrData.length());
            telemetry.addData("Data", qrData.substring(0, previewLength));
            if (qrData.length() > 200) {
                telemetry.addData("", "... (" + (qrData.length() - 200) + " more chars)");
            }
            
            telemetry.update();
            sleep(5000);  // Show for 5 seconds
            
        } catch (Exception e) {
            telemetry.addData("Preview Error", e.getMessage());
            telemetry.update();
            sleep(2000);
        }
    }
    
    /**
     * Clear all scanned data
     */
    private void clearScans() {
        scannedConfigs.clear();
        telemetry.addData("Action", "Cleared all scans");
        telemetry.update();
        sleep(1000);
    }
    
    /**
     * Save unified JSON and finish
     */
    private void saveAndFinish() {
        if (scannedConfigs.isEmpty()) {
            telemetry.addData("Error", "No matches to save");
            telemetry.addData("", "Scan at least one QR code first");
            telemetry.update();
            sleep(2000);
            return;
        }
        
        telemetry.clear();
        telemetry.addData("Action", "Saving unified match data...");
        telemetry.update();
        
        try {
            // Merge all scanned configs into one
            MatchDataConfig unified = mergeConfigs(scannedConfigs);
            
            // Get list of match numbers for display
            java.util.List<Integer> matchNumbers = new java.util.ArrayList<>();
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
            
            telemetry.clear();
            telemetry.addData("SUCCESS!", "");
            telemetry.addLine();
            telemetry.addData("Saved", unified.matches.size() + " match(es)");
            telemetry.addData("Match Numbers", matchNumbers.toString());
            telemetry.addData("File", OUTPUT_FILE);
            telemetry.addLine();
            telemetry.addData("Note", "Duplicate match numbers overwritten");
            telemetry.addData("", "Ready for autonomous!");
            telemetry.addLine();
            telemetry.addData("Press STOP", "to exit");
            telemetry.update();
            
            // Wait for stop
            while (opModeIsActive()) {
                sleep(100);
            }
            
        } catch (IOException e) {
            telemetry.clear();
            telemetry.addData("SAVE ERROR", "");
            telemetry.addData("Message", e.getMessage());
            telemetry.addData("Path", OUTPUT_FILE);
            telemetry.addLine();
            telemetry.addData("Press B", "to retry");
            telemetry.addData("Press X", "to cancel");
            telemetry.update();
            
            sleep(3000);
        } catch (Exception e) {
            telemetry.clear();
            telemetry.addData("ERROR", e.getMessage());
            telemetry.update();
            sleep(3000);
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
        // Key: match number, Value: match wrapper
        java.util.Map<Integer, org.firstinspires.ftc.teamcode.auto.config.MatchWrapper> matchMap = 
            new java.util.TreeMap<>();
        
        // Process configs in order - later configs overwrite earlier ones
        for (MatchDataConfig config : configs) {
            if (config.matches != null) {
                for (org.firstinspires.ftc.teamcode.auto.config.MatchWrapper wrapper : config.matches) {
                    if (wrapper.match != null) {
                        int matchNumber = wrapper.match.number;
                        // This will overwrite if match number already exists
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
        // Using Gson for pretty printing
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
