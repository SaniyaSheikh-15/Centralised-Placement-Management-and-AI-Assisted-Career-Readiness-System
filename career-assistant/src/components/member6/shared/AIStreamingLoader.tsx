'use client';

export default function AIStreamingLoader() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full ai-gradient"
            style={{
              animation: `ai-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-text-muted ml-2">AI is thinking...</span>
    </div>
  );
}
