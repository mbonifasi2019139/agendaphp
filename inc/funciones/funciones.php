<?php

function obtenerContactos()
{
    include 'db.php';
    try {
        return $conn->query("SELECT id, nombre, empresa, telefono FROM contacto");
    } catch (Exception $e) {
        echo "Error!" . $e->getMessage() . "<br>";
        return false;
    }
};


// Obtiene un contacto trae un id

function obtenerContacto($id)
{
    include 'db.php';
    try {
        return $conn->query("SELECT id, nombre, empresa, telefono FROM contacto WHERE id = $id ");
    } catch (Exception $e) {
        echo "Error!" . $e->getMessage() . "<br>";
        return false;
    }
};
