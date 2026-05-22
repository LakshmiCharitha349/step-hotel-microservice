package com.step.hotel.exceptions;


import java.util.Date;

public record ErrorDetails(Date timestamp, String message, String details) {
}
