<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require '../src/conexion.php'; // Asegurate de tener $conn (PDO)

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

$fecha = date('Y-m-d');
$estado = 'Presente'; // o 1 si usás valores numéricos

try {
    $conn->beginTransaction();

    $sql = "
        INSERT INTO asistencias_registradas (id_asistencia, fecha, estado)
        SELECT :id, :fecha, :estado
        WHERE NOT EXISTS (
            SELECT 1 FROM asistencias_registradas
            WHERE id_asistencia = :id AND fecha = :fecha
        )
    ";
    $stmt = $conn->prepare($sql);

    foreach ($data as $id) {
        $stmt->execute([
            ':id' => $id,
            ':fecha' => $fecha,
            ':estado' => $estado
        ]);
    }

    $conn->commit();
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar: ' . $e->getMessage()]);
}
?>