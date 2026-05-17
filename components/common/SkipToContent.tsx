type SkipToContentProps = {
  label: string;
  targetId?: string;
};

export function SkipToContent({
  label,
  targetId = "main-content",
}: SkipToContentProps) {
  return (
    <a className="skip-to-content" href={`#${targetId}`}>
      {label}
    </a>
  );
}
