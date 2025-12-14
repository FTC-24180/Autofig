package org.firstinspires.ftc.teamcode.auto;

import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;

import org.firstinspires.ftc.teamcode.auto.config.Action;
import org.firstinspires.ftc.teamcode.auto.config.AutoConfigParser;
import org.firstinspires.ftc.teamcode.auto.config.Match;
import org.firstinspires.ftc.teamcode.auto.config.MatchDataConfig;
import org.firstinspires.ftc.teamcode.auto.config.StartPosition;

/**
 * Example FTC OpMode using AutoConfig match data
 * 
 * This demonstrates how to:
 * 1. Load and parse match data from JSON
 * 2. Extract start position and actions
 * 3. Execute autonomous sequence
 */
@Autonomous(name = "AutoConfig Example", group = "Auto")
public class AutoConfigOpModeExample extends LinearOpMode {
    
    // Path to your match data JSON file
    // Update this to match your file location
    private static final String MATCH_DATA_FILE = "/sdcard/FIRST/match-data.json";
    
    // Match number to execute (update based on current match)
    private static final int MATCH_NUMBER = 1;
    
    @Override
    public void runOpMode() throws InterruptedException {
        telemetry.addData("Status", "Initializing...");
        telemetry.update();
        
        // Initialize your robot hardware here
        // Example: drive = new MecanumDrive(hardwareMap);
        
        // Parse match data
        MatchDataConfig config = loadMatchData();
        if (config == null) {
            telemetry.addData("Error", "Failed to load match data");
            telemetry.update();
            return;
        }
        
        // Get current match
        AutoConfigParser parser = new AutoConfigParser();
        Match match = parser.getMatchByNumber(config, MATCH_NUMBER);
        
        if (match == null) {
            telemetry.addData("Error", "Match " + MATCH_NUMBER + " not found");
            telemetry.update();
            return;
        }
        
        // Display match info
        telemetry.addData("Match", match.number);
        telemetry.addData("Alliance", match.alliance.color);
        telemetry.addData("Partner", match.alliance.team_number);
        telemetry.addData("Actions", match.alliance.auto.actions.size());
        telemetry.update();
        
        // Wait for start
        waitForStart();
        
        if (!opModeIsActive()) return;
        
        // Execute autonomous sequence
        executeAutonomous(match);
        
        telemetry.addData("Status", "Complete");
        telemetry.update();
    }
    
    /**
     * Load match data from JSON file
     */
    private MatchDataConfig loadMatchData() {
        try {
            AutoConfigParser parser = new AutoConfigParser();
            return parser.parseFile(MATCH_DATA_FILE);
        } catch (Exception e) {
            telemetry.addData("Parse Error", e.getMessage());
            telemetry.update();
            return null;
        }
    }
    
    /**
     * Execute the autonomous sequence from match data
     */
    private void executeAutonomous(Match match) {
        // Set start position
        setStartPosition(match.alliance.auto.startPosition);
        
        // Execute each action in sequence
        for (int i = 0; i < match.alliance.auto.actions.size(); i++) {
            if (!opModeIsActive()) break;
            
            Action action = match.alliance.auto.actions.get(i);
            
            telemetry.addData("Action", (i + 1) + "/" + match.alliance.auto.actions.size());
            telemetry.addData("Type", action.type);
            telemetry.addData("Label", action.label);
            telemetry.update();
            
            executeAction(action);
        }
    }
    
    /**
     * Set robot start position
     */
    private void setStartPosition(StartPosition position) {
        if (position.isCustom()) {
            telemetry.addData("Start", String.format("Custom (%.1f, %.1f, %.0f°)",
                position.getX(), position.getY(), position.getTheta()));
            
            // TODO: Set your robot's pose using your odometry system
            // Example: drive.setPoseEstimate(new Pose2d(
            //     position.getX(), position.getY(), 
            //     Math.toRadians(position.getTheta())
            // ));
        } else {
            telemetry.addData("Start", position.type);
            
            // TODO: Map preset position types to your robot's start positions
            // Example:
            // switch (position.type) {
            //     case "front": drive.setPoseEstimate(FRONT_START); break;
            //     case "back": drive.setPoseEstimate(BACK_START); break;
            // }
        }
        telemetry.update();
    }
    
    /**
     * Execute a single action
     */
    private void executeAction(Action action) {
        // Map action types to your robot's commands
        switch (action.type) {
            case "near_launch":
                executeNearLaunch();
                break;
                
            case "far_launch":
                executeFarLaunch();
                break;
                
            case "spike_1":
            case "spike_2":
            case "spike_3":
                navigateToSpike(action.type);
                break;
                
            case "corner":
                navigateToCorner();
                break;
                
            case "near_park":
            case "far_park":
                executePark(action.type);
                break;
                
            case "dump":
                executeDump();
                break;
                
            case "drive_to":
                executeDriveTo(action);
                break;
                
            case "wait":
                executeWait(action);
                break;
                
            default:
                telemetry.addData("Warning", "Unknown action: " + action.type);
                telemetry.update();
        }
    }
    
    // ========== Action Implementations ==========
    // Replace these with your actual robot commands
    
    private void executeNearLaunch() {
        telemetry.addData("Executing", "Near Launch");
        telemetry.update();
        // TODO: Implement near launch sequence
        sleep(1000);
    }
    
    private void executeFarLaunch() {
        telemetry.addData("Executing", "Far Launch");
        telemetry.update();
        // TODO: Implement far launch sequence
        sleep(1000);
    }
    
    private void navigateToSpike(String spikeType) {
        telemetry.addData("Executing", "Navigate to " + spikeType);
        telemetry.update();
        // TODO: Implement spike navigation
        // Use spike number: spikeType.substring(6) to get "1", "2", or "3"
        sleep(1000);
    }
    
    private void navigateToCorner() {
        telemetry.addData("Executing", "Navigate to Corner");
        telemetry.update();
        // TODO: Implement corner navigation
        sleep(1000);
    }
    
    private void executePark(String parkType) {
        telemetry.addData("Executing", parkType.contains("near") ? "Near Park" : "Far Park");
        telemetry.update();
        // TODO: Implement parking
        sleep(1000);
    }
    
    private void executeDump() {
        telemetry.addData("Executing", "Dump");
        telemetry.update();
        // TODO: Implement dump mechanism
        sleep(1000);
    }
    
    private void executeDriveTo(Action action) {
        if (!action.hasConfig()) {
            telemetry.addData("Warning", "DriveTo missing config");
            telemetry.update();
            return;
        }
        
        double x = action.getConfigDouble("x", 0);
        double y = action.getConfigDouble("y", 0);
        String target = action.getConfigString("target", "");
        
        telemetry.addData("Executing", String.format("Drive to (%.1f, %.1f)", x, y));
        if (!target.isEmpty()) {
            telemetry.addData("Target", target);
        }
        telemetry.update();
        
        // TODO: Drive to coordinates
        // Example: drive.followTrajectorySequence(
        //     drive.trajectorySequenceBuilder(drive.getPoseEstimate())
        //         .lineToLinearHeading(new Pose2d(x, y, drive.getPoseEstimate().getHeading()))
        //         .build()
        // );
        
        sleep(1000);
    }
    
    private void executeWait(Action action) {
        int waitTime = action.getConfigInt("waitTime", 1000);
        
        telemetry.addData("Executing", "Wait " + waitTime + "ms");
        telemetry.update();
        
        sleep(waitTime);
    }
}
