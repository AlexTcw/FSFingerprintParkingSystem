package com.fingerprint.parkingfpaaccessmanager;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class ParkingFpaAccessManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParkingFpaAccessManagerApplication.class, args);
    }

    @PostConstruct
    public void init(){
        // Establecer la zona horaria predeterminada
        TimeZone.setDefault(TimeZone.getTimeZone("America/Monterrey"));
    }

}
