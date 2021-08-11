package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.PracticeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Practice} and its DTO {@link PracticeDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PracticeMapper extends EntityMapper<PracticeDTO, Practice> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PracticeDTO toDtoId(Practice practice);
}
