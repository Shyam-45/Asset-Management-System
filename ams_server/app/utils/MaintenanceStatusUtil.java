package utils;

import enums.MaintenanceStatus;
import exceptions.BadRequestException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class MaintenanceStatusUtil {

    public static List<MaintenanceStatus> parseStatuses(String status) {

        if (status == null || status.equalsIgnoreCase("ALL")) {
            return null;
        }

        try {
            return Arrays.stream(status.split(",")).map(String::trim).map(String::toUpperCase).map(MaintenanceStatus::valueOf).collect(Collectors.toList());

        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid maintenance status");
        }
    }
}