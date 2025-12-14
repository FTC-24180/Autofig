package org.firstinspires.ftc.teamcode.auto.config;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

/**
 * Parser for FTC AutoConfig match data JSON files
 * Schema Version: 1.0.0
 * 
 * Usage:
 *   AutoConfigParser parser = new AutoConfigParser();
 *   MatchDataConfig config = parser.parseFile("/path/to/match-data.json");
 *   
 * Or parse from string:
 *   MatchDataConfig config = parser.parseJson(jsonString);
 */
public class AutoConfigParser {
    
    private final Gson gson;
    private static final String SUPPORTED_VERSION = "1.0.0";
    
    public AutoConfigParser() {
        this.gson = new Gson();
    }
    
    /**
     * Parse match data from a JSON file
     * @param filePath Path to the JSON file
     * @return Parsed MatchDataConfig object
     * @throws IOException If file cannot be read
     * @throws IllegalArgumentException If JSON is invalid or version unsupported
     */
    public MatchDataConfig parseFile(String filePath) throws IOException {
        try (FileReader reader = new FileReader(filePath)) {
            return parseFromReader(reader);
        }
    }
    
    /**
     * Parse match data from a JSON string
     * @param jsonString JSON string containing match data
     * @return Parsed MatchDataConfig object
     * @throws IllegalArgumentException If JSON is invalid or version unsupported
     */
    public MatchDataConfig parseJson(String jsonString) {
        JsonObject root = JsonParser.parseString(jsonString).getAsJsonObject();
        return parseRoot(root);
    }
    
    private MatchDataConfig parseFromReader(FileReader reader) {
        JsonObject root = JsonParser.parseReader(reader).getAsJsonObject();
        return parseRoot(root);
    }
    
    private MatchDataConfig parseRoot(JsonObject root) {
        // Check for version field
        String version = root.has("version") ? root.get("version").getAsString() : null;
        
        // Validate version
        if (version != null && !isVersionSupported(version)) {
            throw new IllegalArgumentException(
                "Unsupported schema version: " + version + 
                ". Expected: " + SUPPORTED_VERSION
            );
        }
        
        // Parse matches array or single match
        List<MatchWrapper> matchWrappers;
        
        if (root.has("matches")) {
            // Standard format with matches array
            Type listType = new TypeToken<List<MatchWrapper>>(){}.getType();
            matchWrappers = gson.fromJson(root.get("matches"), listType);
        } else if (root.has("match")) {
            // Legacy single match format
            MatchWrapper wrapper = new MatchWrapper();
            wrapper.match = gson.fromJson(root.get("match"), Match.class);
            matchWrappers = List.of(wrapper);
        } else {
            throw new IllegalArgumentException("Invalid JSON: missing 'matches' or 'match' field");
        }
        
        MatchDataConfig config = new MatchDataConfig();
        config.version = version != null ? version : "legacy";
        config.matches = matchWrappers;
        
        return config;
    }
    
    /**
     * Check if a schema version is supported
     * @param version Version string (e.g., "1.0.0")
     * @return true if version is supported
     */
    private boolean isVersionSupported(String version) {
        // For now, we only support exact match
        // Future: implement semantic version comparison
        return SUPPORTED_VERSION.equals(version);
    }
    
    /**
     * Get a specific match by number
     * @param config Match data configuration
     * @param matchNumber Match number to find
     * @return Match object or null if not found
     */
    public Match getMatchByNumber(MatchDataConfig config, int matchNumber) {
        if (config == null || config.matches == null) {
            return null;
        }
        
        for (MatchWrapper wrapper : config.matches) {
            if (wrapper.match != null && wrapper.match.number == matchNumber) {
                return wrapper.match;
            }
        }
        
        return null;
    }
    
    /**
     * Get all matches for a specific alliance color
     * @param config Match data configuration
     * @param color Alliance color ("red" or "blue")
     * @return List of matches for the specified alliance
     */
    public List<Match> getMatchesByAlliance(MatchDataConfig config, String color) {
        if (config == null || config.matches == null) {
            return List.of();
        }
        
        return config.matches.stream()
            .map(wrapper -> wrapper.match)
            .filter(match -> match != null && 
                           match.alliance != null && 
                           color.equalsIgnoreCase(match.alliance.color))
            .toList();
    }
}
