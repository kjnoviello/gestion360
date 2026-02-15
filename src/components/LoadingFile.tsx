import { Icon } from '@iconify/react/dist/iconify.js'

const LoadingFile = () => {
    return (
        <div>
            <Icon icon="lucide:loader-2" className="animate-spin text-default-500" width={24} height={24} />
            <h3 className="text-small text-default-500 mb-1">
                Cargando...
            </h3>
        </div>
    )
}

export default LoadingFile