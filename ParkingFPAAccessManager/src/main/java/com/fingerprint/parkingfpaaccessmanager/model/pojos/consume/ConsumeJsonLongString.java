package com.fingerprint.parkingfpaaccessmanager.model.pojos.consume;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class ConsumeJsonLongString {

    private long value;
    private String label;

}
