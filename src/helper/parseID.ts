
// helper pour valider et parser l'ID utilisateur
export function parseId(param: string): number {
    const id = Number(param);
    if (!Number.isFinite(id) || id <= 0) {
        throw new Error("Invalid ID");
    }
    return id;
}