// A successful push can lose its response. Reconcile against Git before retrying.
export async function publishCandidate({ base, candidate }, git) {
  if (await git(['rev-parse', 'HEAD']) !== candidate) throw new Error('Checkout changed after candidate validation');
  const remoteHead = async () => {
    await git(['fetch', 'origin', 'main']);
    return git(['rev-parse', 'FETCH_HEAD']);
  };
  const contains = async revision => {
    try { await git(['merge-base', '--is-ancestor', candidate, revision]); return true; }
    catch (error) { if (error.code === 1) return false; throw error; }
  };
  let remote = await remoteHead();
  if (await contains(remote)) return true;
  if (remote !== base) return false;
  try {
    // Normal fast-forward push: never override a concurrent update.
    await git(['push', 'origin', `${candidate}:refs/heads/main`]);
    return true;
  } catch (error) {
    remote = await remoteHead();
    if (await contains(remote)) return true;
    if (remote !== base) return false;
    throw new Error('Publication push failed and the candidate is not on main', { cause: error });
  }
}
