<?php
date_default_timezone_set("America/Argentina/Buenos_Aires");

try {
    $conn = new PDO("mysql:host=localhost;dbname=c2821298_erm;charset=utf8", "c2821298_erm", "do59GOtego");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>