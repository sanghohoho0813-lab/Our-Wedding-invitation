/** 픽셀 하트 — 콩닥콩닥 뛴다. (dev-beat 는 globals.css) */
const ROWS = [
  "..##...##..",
  ".####.####.",
  "###########",
  "###########",
  ".#########.",
  "..#######..",
  "...#####...",
  "....###....",
  ".....#.....",
];

export function PixelHeart({ size = 9 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="dev-beat grid w-fit"
      style={{ gridTemplateColumns: `repeat(${ROWS[0].length}, ${size}px)`, gap: 2 }}
    >
      {ROWS.flatMap((row, r) =>
        row.split("").map((c, i) => (
          <span
            key={`${r}-${i}`}
            style={{ width: size, height: size }}
            className={c === "#" ? (r < 2 && i % 5 === 2 ? "bg-[#f3b6ff]" : "bg-dev-purple") : ""}
          />
        )),
      )}
    </div>
  );
}
