package com.ticketsystem.service;

// No password hashing is used when storing passwords in plain text.

public class PasswordHashGenerator {

    public static void main(String[] args) {
        // If no password argument is passed
        if (args.length == 0) {
            System.out.println("❌ Please provide a password argument.");
            System.out.println("Usage: mvn exec:java -Dexec.mainClass=com.ticketsystem.service.PasswordHashGenerator -Dexec.args=\"yourPassword\"");
            return;
        }

        // Take the password from command-line arguments
        String rawPassword = args[0];

    // No hashing is applied; passwords are stored as plain text in this configuration.
    System.out.println("====================================");
    System.out.println("✅ Raw Password  : " + rawPassword);
    System.out.println("⚠️ Stored As     : plain text (NoOp)");
    System.out.println("====================================");
    }
}
