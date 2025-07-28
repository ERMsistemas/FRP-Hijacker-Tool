<?php
session_start();
include '../src/conexion.php';
header('Content-Type: application/json');
//error_reporting(0);
if (!isset($_SESSION['login'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$horarioAsignado = $_SESSION['login']; // contiene el valor de preceptor.usuario

$sql = "
SELECT 
    a.id,
    CONCAT(a.apellido, ' ', a.nombre) AS alumno,
    a.dni,
    a.horario_cursado AS curso,
    ar.estado
FROM asistencias a
LEFT JOIN asistencias_registradas ar 
    ON ar.id_asistencia = a.id AND ar.fecha = CURDATE()
WHERE a.preceptor = :idpreceptor
ORDER BY FIELD(ar.estado, 'Presente', 'Tardanza', 'Ausente') DESC
";

$stmt = $conn->prepare($sql);
$stmt->bindParam(':idpreceptor', $horarioAsignado);
$stmt->execute();

$datos = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $datos[] = [
        'id' => $row['id'],
        'alumno' => $row['alumno'],
        'dni' => $row['dni'],
        'curso' => $row['curso'],
        'asistencias' => $row['estado']
    ];
}
echo json_encode($datos);
?>