<?php
// Credenciales de la base de datos
define('DB_HOST', 'localhost');
define('DB_USUARIO', 'root');
define('DB_PASSWORD', 'admin2020');
define('DB_NOMBRE', 'dbagendaphp');


$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE, 3307);

if ($conn->connect_error) {
    echo $error->$conn->connect_error;
}
