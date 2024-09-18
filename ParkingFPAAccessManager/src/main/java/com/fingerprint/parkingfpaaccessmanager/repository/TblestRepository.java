package com.fingerprint.parkingfpaaccessmanager.repository;

import com.fingerprint.parkingfpaaccessmanager.model.entity.Tblest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TblestRepository extends JpaRepository<Tblest, Long> {

    //boolean existsTblestByCveest(long cveest);

    Tblest findTblestByCveest(long cveest);

    @Query(value = """
            SELECT e.*
            FROM tblest e
            INNER JOIN tblregistry r ON r.cveest = e.cveest
            INNER JOIN tblusr u ON u.cveusr = r.cveusr
            WHERE e.exitdate IS NULL
            AND u.tokenusr = :token
            """, nativeQuery = true)
    List<Tblest> findActiveEstWithToken(@Param("token") String token);

    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM tblest e
                INNER JOIN tblregistry r ON r.cveest = e.cveest
                INNER JOIN tblusr u ON u.cveusr = r.cveusr
                WHERE e.exitdate IS NULL
                AND u.tokenusr = :token
            )
            """, nativeQuery = true)
    Long existsActiveEstWithToken(@Param("token") String token);

    @Query(value = """

            SELECT u.cveusr, u.emailusr, u.loginusr, u.nameusr, e.entrydate
            FROM tblest e
            INNER JOIN tblregistry r ON r.cveest = e.cveest
            INNER JOIN tblusr u ON u.cveusr = r.cveusr
            WHERE e.exitdate IS NULL
            AND (:startDate IS NULL OR :endDate IS NULL
                            			OR e.entrydate BETWEEN\s
                            			CONCAT(STR_TO_DATE(:startDate, '%d/%m/%Y'), ' 00:00:00')\s
                           			 	AND\s
                            			CONCAT(STR_TO_DATE(:endDate, '%d/%m/%Y'), ' 23:59:59'))
            AND (:key IS NULL
                OR (UPPER(REPLACE(u.nameusr, '-', '')) LIKE CONCAT('%', UPPER(REPLACE(:key, '-', '')), '%')
                OR REPLACE(u.cveusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')
                OR REPLACE(u.loginusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')
                OR REPLACE(u.emailusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')))
            AND (:type IS NULL
                OR REPLACE(u.typeusr, '-', '') LIKE CONCAT('%', REPLACE(:type, '-', ''), '%'))
            """, nativeQuery = true)
    Page<Object[]> findActiveEstByRangeTypeOrKey(@Param("startDate") String startDate,
                                           @Param("endDate") String endDate,
                                           @Param("key") String key,
                                                 @Param("type") String type,
                                           Pageable pageable);

    @Query(value = """
            SELECT u.cveusr, u.emailusr, u.loginusr, u.nameusr, e.entrydate
            FROM tblest e
            INNER JOIN tblregistry r ON r.cveest = e.cveest
            INNER JOIN tblusr u ON u.cveusr = r.cveusr
            WHERE e.exitdate IS NOT NULL
            AND (:startDate IS NULL OR :endDate IS NULL
                			OR e.entrydate BETWEEN\s
                			CONCAT(STR_TO_DATE(:startDate, '%d/%m/%Y'), ' 00:00:00')\s
               			 	AND\s
                			CONCAT(STR_TO_DATE(:endDate, '%d/%m/%Y'), ' 23:59:59'))
            AND (:key IS NULL
                OR (UPPER(REPLACE(u.nameusr, '-', '')) LIKE CONCAT('%', UPPER(REPLACE(:key, '-', '')), '%')
                OR REPLACE(u.cveusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')
                OR REPLACE(u.loginusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')
                OR REPLACE(u.emailusr, '-', '') LIKE CONCAT('%', REPLACE(:key, '-', ''), '%')))
            AND (:type IS NULL
                OR REPLACE(u.typeusr, '-', '') LIKE CONCAT('%', REPLACE(:type, '-', ''), '%'))
            """, nativeQuery = true)
    Page<Object[]> findUnActiveEstByRangeTypeOrKey(@Param("startDate") String startDate,
                                                   @Param("endDate") String endDate,
                                                   @Param("key") String key,
                                                   @Param("type") String type,
                                                   Pageable pageable);
}

