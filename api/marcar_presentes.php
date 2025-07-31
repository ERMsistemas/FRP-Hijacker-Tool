<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require '../src/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$seleccionados = $data['seleccionados'] ?? [];
$estado = $data['estado'] ?? '';

if (!is_array($seleccionados) || empty($estado)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

$fecha = date('Y-m-d');

try {
    $conn->beginTransaction();

    if (!empty($seleccionados)) {
        $placeholders = implode(',', array_fill(0, count($seleccionados), '?'));
        $params = array_merge([$fecha], $seleccionados);

        if ($estado === 'Ausente') {
            // Eliminar asistencias del día actual
            $deleteSql = "
                DELETE FROM asistencias_registradas
                WHERE fecha = ? AND id_asistencia IN ($placeholders)
            ";
            $stmtDel = $conn->prepare($deleteSql);
            $stmtDel->execute($params);

        } elseif ($estado === 'Presente') {
            // Insertar asistencias como presentes
            $selects = [];
            foreach ($seleccionados as $id) {
                $selects[] = "SELECT " . intval($id) . " AS id";
            }
            $unionQuery = implode(" UNION ALL ", $selects);

            $insertSql = "
                INSERT INTO asistencias_registradas (id_asistencia, fecha, estado)
                SELECT v.id, :fecha, 'Presente'
                FROM (
                    $unionQuery
                ) AS v
                WHERE NOT EXISTS (
                    SELECT 1 FROM asistencias_registradas ar
                    WHERE ar.id_asistencia = v.id AND ar.fecha = :fecha
                )
            ";
            $stmtIns = $conn->prepare($insertSql);
            $stmtIns->execute([':fecha' => $fecha]);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar: ' . $e->getMessage()]);
}
?>