<?php
session_start();
include '../src/conexion.php'; // Asegurate que $conn sea un objeto PDO

header('Content-Type: application/json');

// Obtener JSON de la petición
$input = json_decode(file_get_contents('php://input'), true);

$usuario = $input['usr'] ?? '';
$pass = $input['pass'] ?? '';

// Consulta segura con parámetros
$sql = "SELECT * FROM preceptor WHERE usuario = :usuario AND password = :pass";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':usuario', $usuario);
$stmt->bindParam(':pass', $pass);
$stmt->execute();

if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $_SESSION['usr'] = $row['idlogin'];
    $_SESSION['login'] = $row['idlogin'];
    echo json_encode(['success' => true, 'user' => $row['usuario']]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false]);
}

?>