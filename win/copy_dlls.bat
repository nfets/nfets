@echo off
setlocal enabledelayedexpansion

set BUILD_DIR=%~1
if "%BUILD_DIR%"=="" (
    echo Error Build directory not specified
    exit /b 1
)

if defined MSYS2_LOCATION (
    set MSYS_ROOT=%MSYS2_LOCATION%
) else (
    set MSYS_ROOT=C:\msys64
)

set DLLS_COPIED=0

set SEARCH_PATHS=%MSYS_ROOT%\mingw64\bin;%MSYS_ROOT%\usr\bin;%MSYS_ROOT%\clang64\bin;%MSYS_ROOT%\ucrt64\bin

echo Searching for libxml2 DLLs in MSYS2 directories...

for %%P in (%SEARCH_PATHS%) do (
    if exist "%%P\libiconv-2.dll" (
        copy /Y "%%P\libiconv-2.dll" "%BUILD_DIR%\" >nul 2>&1
        if !errorlevel! equ 0 (
            echo Copied %%P\libiconv-2.dll
            set DLLS_COPIED=1
        )
    )
    if exist "%%P\zlib1.dll" (
        copy /Y "%%P\zlib1.dll" "%BUILD_DIR%\" >nul 2>&1
        if !errorlevel! equ 0 (
            echo Copied %%P\zlib1.dll
            set DLLS_COPIED=1
        )
    )
    if exist "%%P\libxml2.dll" (
        copy /Y "%%P\libxml2.dll" "%BUILD_DIR%\" >nul 2>&1
        if !errorlevel! equ 0 (
            echo Copied %%P\libxml2.dll
            set DLLS_COPIED=1
        )
    )
    if exist "%%P\libxml2-2.dll" (
        copy /Y "%%P\libxml2-2.dll" "%BUILD_DIR%\" >nul 2>&1
        if !errorlevel! equ 0 (
            echo Copied %%P\libxml2-2.dll
            set DLLS_COPIED=1
        )
    )
    for /f "delims=" %%F in ('dir /b "%%P\libxml2-*.dll" 2^>nul') do (
        copy /Y "%%P\%%F" "%BUILD_DIR%\" >nul 2>&1
        if !errorlevel! equ 0 (
            echo Copied %%P\%%F
            set DLLS_COPIED=1
        )
    )
)

echo. > "%BUILD_DIR%\copy_dlls.flag"

set SAVED_COPIED=!DLLS_COPIED!
endlocal
set DLLS_COPIED=%SAVED_COPIED%

set FOUND_XML=0
if exist "%BUILD_DIR%\libxml2.dll" set FOUND_XML=1
if exist "%BUILD_DIR%\libxml2-2.dll" set FOUND_XML=1
if exist "%BUILD_DIR%\libxml2-16.dll" set FOUND_XML=1
for %%F in ("%BUILD_DIR%\libxml2-*.dll") do set FOUND_XML=1

if "%FOUND_XML%"=="0" (
    echo.
    echo ========================================
    echo WARNING No libxml2 DLLs found!
    echo ========================================
    echo.
    echo Searched in
    echo   C:\msys64\mingw64\bin
    echo   C:\msys64\usr\bin
    echo   C:\msys64\clang64\bin
    echo   C:\msys64\ucrt64\bin
    echo.
)

exit /b 0

