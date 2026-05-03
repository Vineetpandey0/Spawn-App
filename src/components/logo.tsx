'use client'

export default function Logo(){
    return (
        <div className="flex ">
            {["#6366f1","#f472b6","#38bdf8","#4ade80"].map((bg, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: bg,
                marginLeft: i > 0 ? -10 : 0, zIndex: 4 - i,
              }} />
            ))}
        </div>
    )
}