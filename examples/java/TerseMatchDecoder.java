package org.firstinspires.ftc.teamcode.auto.config;

import java.util.ArrayList;
import java.util.List;

/**
 * Decoder for Terse Match Format
 * 
 * Format: {n}[R|B]S{startPos}[W{sec}|A{n}]*
 * Example: 5RS1W1A1A3W2.5A1A4
 * 
 * Supports decimal seconds for wait times (e.g., W1, W2.5, W0.5)
 */
public class TerseMatchDecoder {
    
    /**
     * Decoded match data
     */
    public static class Match {
        public int matchNumber;
        public String alliance;  // "red" or "blue"
        public int startPosition;
        public List<Action> actions;
        
        public Match() {
            actions = new ArrayList<>();
        }
    }
    
    /**
     * Action in a match sequence
     */
    public static class Action {
        public String type;  // "wait" or action ID (e.g., "A1", "A2")
        public double waitTimeSeconds;  // Only for wait actions
        
        public Action(String type) {
            this.type = type;
        }
        
        public Action(String type, double waitTimeSeconds) {
            this.type = type;
            this.waitTimeSeconds = waitTimeSeconds;
        }
    }
    
    /**
     * Decode a terse format string
     * 
     * @param terse Terse format string (e.g., "5RS1W1A1A3W2.5A6")
     * @return Decoded match object
     * @throws IllegalArgumentException if format is invalid
     */
    public static Match decode(String terse) {
        if (terse == null || terse.isEmpty()) {
            throw new IllegalArgumentException("Terse string cannot be null or empty");
        }
        
        Match match = new Match();
        int i = 0;
        
        // Parse match number
        StringBuilder matchNumStr = new StringBuilder();
        while (i < terse.length() && Character.isDigit(terse.charAt(i))) {
            matchNumStr.append(terse.charAt(i));
            i++;
        }
        
        if (matchNumStr.length() == 0) {
            throw new IllegalArgumentException("Missing match number");
        }
        match.matchNumber = Integer.parseInt(matchNumStr.toString());
        
        // Parse alliance color
        if (i >= terse.length()) {
            throw new IllegalArgumentException("Missing alliance color");
        }
        
        char allianceChar = terse.charAt(i);
        match.alliance = (allianceChar == 'R') ? "red" : "blue";
        i++;
        
        // Parse start position
        if (i >= terse.length() || terse.charAt(i) != 'S') {
            throw new IllegalArgumentException("Missing start position (expected 'S')");
        }
        i++; // Skip 'S'
        
        StringBuilder posStr = new StringBuilder();
        while (i < terse.length() && Character.isDigit(terse.charAt(i))) {
            posStr.append(terse.charAt(i));
            i++;
        }
        
        if (posStr.length() == 0) {
            throw new IllegalArgumentException("Missing start position number");
        }
        match.startPosition = Integer.parseInt(posStr.toString());
        
        // Parse actions
        while (i < terse.length()) {
            char actionChar = terse.charAt(i);
            
            if (actionChar == 'W') {
                // Wait action - parse decimal seconds
                i++; // Skip 'W'
                StringBuilder waitStr = new StringBuilder();
                
                // Parse number (including decimal point)
                while (i < terse.length() && (Character.isDigit(terse.charAt(i)) || terse.charAt(i) == '.')) {
                    waitStr.append(terse.charAt(i));
                    i++;
                }
                
                if (waitStr.length() == 0) {
                    throw new IllegalArgumentException("Missing wait time value");
                }
                
                double waitSeconds = Double.parseDouble(waitStr.toString());
                match.actions.add(new Action("wait", waitSeconds));
                
            } else if (actionChar == 'A') {
                // Regular action - parse action ID
                i++; // Skip 'A'
                StringBuilder actionIdStr = new StringBuilder();
                
                while (i < terse.length() && Character.isDigit(terse.charAt(i))) {
                    actionIdStr.append(terse.charAt(i));
                    i++;
                }
                
                if (actionIdStr.length() == 0) {
                    throw new IllegalArgumentException("Missing action ID");
                }
                
                String actionId = "A" + actionIdStr.toString();
                match.actions.add(new Action(actionId));
                
            } else {
                throw new IllegalArgumentException("Unknown action type: " + actionChar);
            }
        }
        
        return match;
    }
    
    /**
     * Convert wait time from seconds to milliseconds
     * 
     * @param seconds Wait time in seconds
     * @return Wait time in milliseconds
     */
    public static int secondsToMillis(double seconds) {
        return (int) Math.round(seconds * 1000);
    }
    
    /**
     * Example usage
     */
    public static void main(String[] args) {
        // Example 1: Integer second waits
        String terse1 = "5RS1W1A1A3W1A6";
        Match match1 = decode(terse1);
        
        System.out.println("Match " + match1.matchNumber);
        System.out.println("Alliance: " + match1.alliance);
        System.out.println("Start Position: " + match1.startPosition);
        System.out.println("Actions:");
        for (Action action : match1.actions) {
            if (action.type.equals("wait")) {
                System.out.println("  Wait " + action.waitTimeSeconds + "s (" + secondsToMillis(action.waitTimeSeconds) + "ms)");
            } else {
                System.out.println("  Action " + action.type);
            }
        }
        
        System.out.println("\n---\n");
        
        // Example 2: Decimal second waits
        String terse2 = "12BS2W0.5A1W2.5A3W1A6";
        Match match2 = decode(terse2);
        
        System.out.println("Match " + match2.matchNumber);
        System.out.println("Alliance: " + match2.alliance);
        System.out.println("Start Position: " + match2.startPosition);
        System.out.println("Actions:");
        for (Action action : match2.actions) {
            if (action.type.equals("wait")) {
                System.out.println("  Wait " + action.waitTimeSeconds + "s (" + secondsToMillis(action.waitTimeSeconds) + "ms)");
            } else {
                System.out.println("  Action " + action.type);
            }
        }
    }
}
