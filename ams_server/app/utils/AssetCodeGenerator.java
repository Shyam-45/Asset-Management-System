package utils;

import enums.AssetCategory;

import javax.inject.Singleton;

@Singleton
public class AssetCodeGenerator {

    public String generate(AssetCategory category, Long sequence) {

        String prefix;

        switch (category) {

            case LAPTOP:
                prefix = "LAP";
                break;

            case MONITOR:
                prefix = "MON";
                break;

            case KEYBOARD:
                prefix = "KEY";
                break;

            case MOUSE:
                prefix = "MOU";
                break;

            case PRINTER:
                prefix = "PRN";
                break;

            case PROJECTOR:
                prefix = "PROJ";
                break;

            default:
                prefix = "OTH";
        }

        return String.format("%s-%04d", prefix, sequence);
    }
}