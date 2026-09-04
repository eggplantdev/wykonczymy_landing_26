type PropsT = {
  id: string
  placeholder: string
  type?: 'text' | 'email' | 'tel'
  className?: string
}

export function ContactFormInput({ id, placeholder, type = 'text', className }: PropsT) {
  return (
    <label htmlFor={id} className={className}>
      <span className="sr-only">{placeholder}</span>
      <input
        className="border-grau_300 focus:border-grau_100 text-12 text-grau_300 w-full border-0 border-b bg-transparent pt-8 pb-2 pl-0 focus:ring-0"
        id={id}
        name={id}
        placeholder={placeholder}
        type={type}
      />
    </label>
  )
}
