# 음악 파일 위치

이 폴더에 `wedding-theme.mp3` 를 넣은 뒤
`src/config/wedding.ts` 의 `music.enabled` 를 `true` 로 바꾸면
우측 상단에 음악 컨트롤이 나타납니다.

`.aif` / `.aiff` 원본은 브라우저에서 재생되지 않으므로 변환이 필요합니다.

```bash
ffmpeg -i wedding-theme.aif -codec:a libmp3lame -b:a 192k public/audio/wedding-theme.mp3
```

자세한 내용은 프로젝트 루트의 README.md 4번 항목을 참고하세요.
