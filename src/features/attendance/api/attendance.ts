
export const getQRUrl = async (userId: string): Promise<string> => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=USER_${userId}_${Date.now()}`;
};
