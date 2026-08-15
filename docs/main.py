from mkdocs_macros.plugin import MacrosPlugin


def define_env(env: MacrosPlugin):
    @env.macro
    def loop_video(
        bestand,
        titel,
        beschrijving,
        thumbnail,
        datum,
        duur,
        max_breedte,
    ):
        return f"""
<video controls autoplay muted loop playsinline
        style="display: block; width: 100%; max-width: {max_breedte}; margin-inline: auto;">
  <source src="../../../assets/videos/{bestand}" type="video/mp4">
</video>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "{titel}",
  "description": "{beschrijving}",
  "thumbnailUrl": ["../../assets/images/{thumbnail}"],
  "uploadDate": "{datum}T12:00:00+02:00",
  "duration": "{duur}",
  "contentUrl": "../../assets/videos/{bestand}"
}}
</script>
"""