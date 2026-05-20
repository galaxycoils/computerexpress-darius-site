/**
 * Hook for sharing conversation threads by threadId.
 * The consumer's backend looks up messages by threadId.
 *
 * @category Hooks
 */
export declare const useShareThread: ({ generateShareLink, }: {
    generateShareLink: (threadId: string) => Promise<string>;
}) => {
    shouldDisableShareButton: boolean;
    hasMessages: boolean;
    getShareThreadLink: () => Promise<string>;
};
//# sourceMappingURL=useShareThread.d.ts.map