package com.fingerprint.parkingfpaaccessmanager.service.webSocket;

import com.fingerprint.parkingfpaaccessmanager.model.pojos.response.ResponseJsonGeneric;

public interface WebSocketService {

    ResponseJsonGeneric findUserByToken(String token);
}
