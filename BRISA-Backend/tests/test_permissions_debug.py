"""
tests/test_permissions_debug.py
Test de diagnóstico para verificar sistema de permisos
"""
import pytest
from app.shared.permission_mapper import (
    tiene_permiso, es_administrador, obtener_permisos_usuario,
    puede_modificar_usuario, ADMIN_ROLES, PERMISSION_MAP
)


def test_admin_tiene_todos_los_permisos(usuario_admin_autenticado, db_session):
    """Verificar que el usuario admin tiene todos los permisos"""
    usuario = usuario_admin_autenticado["usuario"]
    
    # Verificar que es administrador
    print(f"\n🔍 ID Usuario: {usuario.id_usuario}")
    print(f"🔍 Usuario: {usuario.usuario}")
    
    # Verificar roles
    roles = [r.nombre for r in usuario.roles if r.is_active]
    print(f"🔍 Roles del usuario: {roles}")
    print(f"🔍 ADMIN_ROLES definidos: {ADMIN_ROLES}")
    
    assert len(roles) > 0, "Usuario no tiene roles"
    assert "Admin" in roles, f"Usuario debería tener rol 'Admin', tiene: {roles}"
    
    # Verificar que es administrador
    es_admin = es_administrador(usuario)
    print(f"🔍 ¿Es administrador? {es_admin}")
    assert es_admin, "Usuario debería ser administrador"
    
    # Verificar permisos genéricos
    permisos = obtener_permisos_usuario(usuario)
    print(f"🔍 Permisos genéricos: {permisos}")
    assert "Lectura" in permisos
    assert "Agregar" in permisos
    assert "Modificar" in permisos
    assert "Eliminar" in permisos
    
    # Verificar acciones específicas
    assert tiene_permiso(usuario, "editar_usuario"), "Debería poder editar usuarios"
    assert tiene_permiso(usuario, "eliminar_usuario"), "Debería poder eliminar usuarios"
    assert tiene_permiso(usuario, "crear_usuario"), "Debería poder crear usuarios"
    
    # NUEVO: Verificar puede_modificar_usuario
    puede_modificar = puede_modificar_usuario(usuario, 9999)
    print(f"🔍 ¿Puede modificar usuario 9999? {puede_modificar}")
    assert puede_modificar, "Admin debería poder modificar cualquier usuario"
    
    print("✅ Todas las verificaciones de permisos pasaron")


def test_mapeo_permisos():
    """Verificar que el mapeo de permisos está correcto"""
    print(f"\n🔍 Roles admin: {ADMIN_ROLES}")
    print(f"🔍 Mapeo de permisos:")
    for accion, permisos in PERMISSION_MAP.items():
        print(f"  {accion} -> {permisos}")
    
    # Verificar que "Admin" está en ADMIN_ROLES
    assert "Admin" in ADMIN_ROLES, f"'Admin' debería estar en ADMIN_ROLES: {ADMIN_ROLES}"
    
    # Verificar que las acciones clave están mapeadas
    assert "editar_usuario" in PERMISSION_MAP
    assert "eliminar_usuario" in PERMISSION_MAP
    assert PERMISSION_MAP["editar_usuario"] == ["Modificar"]
    assert PERMISSION_MAP["eliminar_usuario"] == ["Eliminar"]
    
    print("✅ Mapeo de permisos correcto")


def test_admin_puede_modificar_otros_usuarios(usuario_admin_autenticado, crear_usuario_base, db_session):
    """Test específico: admin puede modificar otros usuarios"""
    admin = usuario_admin_autenticado["usuario"]
    
    # Crear un usuario cualquiera
    otro_usuario = crear_usuario_base("otro_user_test", "pass123")
    db_session.flush()
    
    print(f"\n🔍 Admin ID: {admin.id_usuario}")
    print(f"🔍 Otro usuario ID: {otro_usuario.id_usuario}")
    
    # El admin debería poder modificar al otro usuario
    puede_modificar = puede_modificar_usuario(admin, otro_usuario.id_usuario)
    print(f"🔍 ¿Admin puede modificar otro usuario? {puede_modificar}")
    
    assert puede_modificar, "Admin debería poder modificar otros usuarios"
    print("✅ Test pasado: Admin puede modificar otros usuarios")