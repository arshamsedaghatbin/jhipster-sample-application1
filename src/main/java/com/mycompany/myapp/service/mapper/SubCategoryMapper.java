package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.SubCategoryDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SubCategory} and its DTO {@link SubCategoryDTO}.
 */
@Mapper(componentModel = "spring", uses = { ActionMapper.class, CategoryMapper.class })
public interface SubCategoryMapper extends EntityMapper<SubCategoryDTO, SubCategory> {
    @Mapping(target = "actions", source = "actions", qualifiedByName = "idSet")
    @Mapping(target = "category", source = "category", qualifiedByName = "id")
    SubCategoryDTO toDto(SubCategory s);

    @Mapping(target = "removeAction", ignore = true)
    SubCategory toEntity(SubCategoryDTO subCategoryDTO);
}
