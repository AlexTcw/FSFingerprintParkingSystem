package com.fingerprint.parkingfpaaccessmanager.controller.webSocket;

import com.fingerprint.parkingfpaaccessmanager.model.pojos.consume.ConsumeJsonString;
import com.fingerprint.parkingfpaaccessmanager.model.pojos.response.ResponseJsonGeneric;
import com.fingerprint.parkingfpaaccessmanager.model.pojos.util.ResponseJsonHandler;
import com.fingerprint.parkingfpaaccessmanager.model.webSocket.HelloMessage;
import com.fingerprint.parkingfpaaccessmanager.service.usuario.UsuarioService;
import com.fingerprint.parkingfpaaccessmanager.service.webSocket.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
public class WSRestController {

    final
    WSController wsController;

    final
    UsuarioService usuarioService;

    final
    WebSocketService webSocketService;

    public WSRestController(WSController wsController, UsuarioService usuarioService, WebSocketService webSocketService) {
        this.wsController = wsController;
        this.usuarioService = usuarioService;
        this.webSocketService = webSocketService;
    }

    @PostMapping("/api/sendGreeting")
    public ResponseEntity<ResponseJsonGeneric>validateTokenAndTriggerWS(@RequestBody ConsumeJsonString consume){
        return getResponseJsonGenericResponseEntity(consume);

    }

    @PostMapping("api/sendSignal")
    public ResponseEntity<ResponseJsonGeneric>sendSignalWS(@RequestBody ConsumeJsonString consume){
        return getResponseJsonGenericResponseEntity(consume);
    }

    private ResponseEntity<ResponseJsonGeneric> getResponseJsonGenericResponseEntity(@RequestBody ConsumeJsonString consume) {
        ResponseJsonGeneric response;
        try {
            response = webSocketService.findUserByToken(consume.getName());
            wsController.sendGreeting(consume.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ResponseJsonHandler errorResponse = new ResponseJsonHandler();
            response = errorResponse.serverErrorResponse("An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
