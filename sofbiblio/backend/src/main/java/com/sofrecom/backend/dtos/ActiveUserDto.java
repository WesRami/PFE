package com.sofrecom.backend.dtos;

public record ActiveUserDto(
        Long id,
        String firstname,
        String lastname,
        String email,
        int loans,
        String image
) {}