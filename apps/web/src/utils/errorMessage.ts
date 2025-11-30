// apps/web/src/utils/errorMessage.ts
export function extractErrorMessage(err: any): string {
  if (!err) return 'Une erreur est survenue';

  // If backend returned { message: 'text' }
  if (typeof err.message === 'string') return err.message;

  // If backend returned { message: { message: 'text' } }
  if (err.message?.message) return err.message.message;

  // If backend returned { response: { message: 'text' } }
  if (err.response?.message) return err.response.message;

  // If backend returned array (like validation error)
  if (Array.isArray(err.message)) return err.message.join(', ');

  return 'Une erreur est survenue';
}

