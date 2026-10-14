<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep fallback content IDs deterministic at module scope so serverless startup and hydration remain stable.
- Each mounted content hook owns a unique realtime channel to avoid duplicate-subscription conflicts.
- Form success requires a completed write; preserve input and show errors on failure.
- Keep internal platform build and error-reporting integrations; they are not user-facing branding.
