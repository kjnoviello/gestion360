/**
 * Convierte "YYYY-MM-DD" a "DD/MM/YYYY"
 * NO usa Date, NO usa timezone
 */
export const formatDate = (date: string): string => {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};