export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const logError = (error) => {
    // Can be replaced with Crashlytics or Sentry
    console.error('[App Error]:', error);
};
