package com.fingerprint.parkingfpaaccessmanager.service.webSocket;

import com.fingerprint.parkingfpaaccessmanager.dao.usuario.UsuarioDao;
import com.fingerprint.parkingfpaaccessmanager.model.entity.Tblusr;
import com.fingerprint.parkingfpaaccessmanager.model.pojos.response.ResponseJsonGeneric;
import com.fingerprint.parkingfpaaccessmanager.model.pojos.util.ResponseJsonHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WebSocketServiceImp implements WebSocketService {

    final
    UsuarioDao usuarioDao;

    public WebSocketServiceImp(UsuarioDao usuarioDao) {
        this.usuarioDao = usuarioDao;
    }

    @Override
    public ResponseJsonGeneric findUserByToken(String token) {
        ResponseJsonHandler response = new ResponseJsonHandler();

        if (token == null || token.isEmpty()) {
            return response.badRequestResponse("Json Null or malformed", token);
        }

        if (!usuarioDao.existsTblusrByTokenusr(token)) {
            return response.notFoundResponse("user not found");
        }

        Tblusr usr = usuarioDao.findTblusrByTokenusr(token);

        return response.okResponse("User Found successfully",usr);
    }
}
