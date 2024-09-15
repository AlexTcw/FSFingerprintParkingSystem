package com.fingerprint.parkingfpaaccessmanager.repository;

import com.fingerprint.parkingfpaaccessmanager.model.entity.Tblusr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TblusrRepository extends JpaRepository<Tblusr, Long> {

    boolean existsTblusrByCveusr(long cveusr);

    boolean existsTblusrByLoginusr(String loginUsr);

    boolean existsTblusrByEmailusr(String emailUsr);

    boolean existsTblusrByTokenusr(String tokenUsr);

    Tblusr findTblusrByCveusr(long cveusr);

    Tblusr findTblusrByLoginusrAndPasswordusr(String loginUsr, String passwordUsr);

    Tblusr findTblusrByEmailusrAndPasswordusr(String emailUsr, String passwordUsr);

    Tblusr findTblusrByTokenusr(String token);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_idcar WHERE cveusr = :cveusr", nativeQuery = true)
    void deleteIdCarFromUsrByCveusr(@Param("cveusr") long cveusr);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tblusr WHERE cveusr = :cveusr", nativeQuery = true)
    void deleteTblusrByCveusr(@Param("cveusr") long cveusr);

    @Query(value = """
            SELECT *\s
            FROM user_idcar ui
            WHERE ui.cveusr = :cveusr""", nativeQuery = true)
    List<Object[]> findAllCarIdByCveusr(@Param("cveusr") long cveusr);

    List<Tblusr> findAllByTypeusr(String typeusr);

    @Query(value = """
        SELECT u.*
        from tblusr u
        WHERE u.tokenusr is not null
        AND (:key IS NULL
                        OR (UPPER(REPLACE(u.nameusr, '-', '')) LIKE CONCAT('%', UPPER(REPLACE(:key, '-', '')), '%')
                        OR REPLACE(u.cveusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')
                        OR REPLACE(u.loginusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')
                        OR REPLACE(u.emailusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')))
                    AND (:type IS NULL
                        OR REPLACE(u.typeusr, '-', '') LIKE CONCAT('%', REPLACE(:type, '-', ''), '%'))
        """,nativeQuery = true)
    Page<Object> findAllUsersByType(@Param("key") String key,
                                    @Param("type") String typeusr, Pageable pageable);
}
