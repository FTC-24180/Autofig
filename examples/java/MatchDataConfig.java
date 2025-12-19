package org.firstinspires.ftc.teamcode.auto.config;

import java.util.List;
import java.util.Map;

/**
 * Data classes for FTC AutoConfig match data JSON representation
 * 
 * These classes represent the JSON structure from the AutoConfig web app.
 * Used internally by the QR scanner and terse decoder for JSON output.
 */
public class MatchDataConfig {
    public String version;
    public List<MatchWrapper> matches;
    
    /**
     * Wrapper for individual match
     */
    public static class MatchWrapper {
        public Match match;
    }
    
    /**
     * Match configuration
     */
    public static class Match {
        public int number;
        public Alliance alliance;
    }
    
    /**
     * Alliance-specific configuration
     */
    public static class Alliance {
        public String color;  // "red" or "blue"
        public int team_number;
        public Autonomous auto;
    }
    
    /**
     * Autonomous period configuration
     */
    public static class Autonomous {
        public StartPosition startPosition;
        public List<Action> actions;
    }
    
    /**
     * Robot starting position
     * Can be either a preset (just type) or custom (type + coordinates)
     */
    public static class StartPosition {
        public String type;
        
        // Optional: only present if type is "custom"
        public Double x;
        public Double y;
        public Double theta;  // degrees
        
        /**
         * Check if this is a custom position
         */
        public boolean isCustom() {
            return "custom".equalsIgnoreCase(type);
        }
        
        /**
         * Get X coordinate (0 if not custom)
         */
        public double getX() {
            return x != null ? x : 0.0;
        }
        
        /**
         * Get Y coordinate (0 if not custom)
         */
        public double getY() {
            return y != null ? y : 0.0;
        }
        
        /**
         * Get heading angle in degrees (0 if not custom)
         */
        public double getTheta() {
            return theta != null ? theta : 0.0;
        }
    }
    
    /**
     * Individual action in autonomous sequence
     */
    public static class Action {
        public String type;    // Action type identifier
        public String label;   // Human-readable label
        public Map<String, Object> config;  // Optional configuration parameters
        
        /**
         * Check if action has configuration
         */
        public boolean hasConfig() {
            return config != null && !config.isEmpty();
        }
        
        /**
         * Get a configuration value as String
         */
        public String getConfigString(String key, String defaultValue) {
            if (config == null || !config.containsKey(key)) {
                return defaultValue;
            }
            Object value = config.get(key);
            return value != null ? value.toString() : defaultValue;
        }
        
        /**
         * Get a configuration value as double
         */
        public double getConfigDouble(String key, double defaultValue) {
            if (config == null || !config.containsKey(key)) {
                return defaultValue;
            }
            Object value = config.get(key);
            if (value instanceof Number) {
                return ((Number) value).doubleValue();
            }
            try {
                return Double.parseDouble(value.toString());
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        
        /**
         * Get a configuration value as int
         */
        public int getConfigInt(String key, int defaultValue) {
            if (config == null || !config.containsKey(key)) {
                return defaultValue;
            }
            Object value = config.get(key);
            if (value instanceof Number) {
                return ((Number) value).intValue();
            }
            try {
                return Integer.parseInt(value.toString());
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        
        /**
         * Get a configuration value as boolean
         */
        public boolean getConfigBoolean(String key, boolean defaultValue) {
            if (config == null || !config.containsKey(key)) {
                return defaultValue;
            }
            Object value = config.get(key);
            if (value instanceof Boolean) {
                return (Boolean) value;
            }
            return Boolean.parseBoolean(value.toString());
        }
    }
}
