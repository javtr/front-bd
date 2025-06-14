import { useState, useEffect } from 'react'
import './App.css'

// Configuración de la aplicación
const CONFIG = {
  // En desarrollo usamos archivos locales, en producción usamos GitHub
  DATA_URL: import.meta.env.DEV 
    ? '/data'
    : 'https://raw.githubusercontent.com/javtr/front-bd/main/public/data',
  // Archivos que necesitamos manejar
  FILES: {
    CLIENTES: 'clientes.json',
    PRODUCTOS: 'productos.json',
    COMPRAS: 'compras.json',
    MEDIOS_PAGO: 'medios-pago.json'
  }
}

function NuevaVenta({ productos, mediosPago, onGuardarVenta }) {
  const [cliente, setCliente] = useState({
    nombre: '',
    id: '',
    mail: '',
    comentario: ''
  })
  const [venta, setVenta] = useState({
    productos: [],
    precioTotal: 0,
    precioFinal: 0,
    medioPago: '',
    cuotas: 1,
    fecha: new Date().toISOString().split('T')[0]
  })
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidadProducto, setCantidadProducto] = useState(1)

  const agregarProducto = () => {
    if (productoSeleccionado) {
      const producto = productos.find(p => p.id === parseInt(productoSeleccionado))
      if (producto) {
        const productoConCantidad = {
          ...producto,
          cantidad: cantidadProducto,
          subtotal: parseFloat(producto.precio) * cantidadProducto
        }
        const nuevoPrecioTotal = venta.precioTotal + productoConCantidad.subtotal
        setVenta(prev => ({
          ...prev,
          productos: [...prev.productos, productoConCantidad],
          precioTotal: nuevoPrecioTotal,
          precioFinal: prev.precioFinal === 0 ? nuevoPrecioTotal : prev.precioFinal
        }))
        setProductoSeleccionado('')
        setCantidadProducto(1)
      }
    }
  }

  const eliminarProducto = (index) => {
    const productoAEliminar = venta.productos[index]
    const nuevoPrecioTotal = venta.precioTotal - productoAEliminar.subtotal
    setVenta(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
      precioTotal: nuevoPrecioTotal,
      precioFinal: prev.precioFinal === prev.precioTotal ? nuevoPrecioTotal : prev.precioFinal
    }))
  }

  const handleMedioPagoChange = (medioPagoId) => {
    const medioPagoSeleccionado = mediosPago.find(mp => mp.id === medioPagoId)
    setVenta(prev => ({
      ...prev,
      medioPago: medioPagoId,
      cuotas: medioPagoSeleccionado?.permiteCuotas ? prev.cuotas : 1
    }))
  }

  const handlePrecioFinalChange = (e) => {
    const nuevoPrecio = parseFloat(e.target.value) || 0
    setVenta(prev => ({
      ...prev,
      precioFinal: nuevoPrecio
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (venta.productos.length === 0) {
      alert('Debe agregar al menos un producto a la venta')
      return
    }
    onGuardarVenta({ cliente, venta })
    // Limpiar formulario
    setCliente({
      nombre: '',
      id: '',
      mail: '',
      comentario: ''
    })
    setVenta({
      productos: [],
      precioTotal: 0,
      precioFinal: 0,
      medioPago: '',
      cuotas: 1,
      fecha: new Date().toISOString().split('T')[0]
    })
  }

  const medioPagoSeleccionado = mediosPago.find(mp => mp.id === venta.medioPago)

  return (
    <div className="nueva-venta">
      <h2>Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Datos del Cliente</h3>
          <input
            type="text"
            placeholder="Nombre del Cliente"
            value={cliente.nombre}
            onChange={(e) => setCliente(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="ID del Cliente"
            value={cliente.id}
            onChange={(e) => setCliente(prev => ({ ...prev, id: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email del Cliente"
            value={cliente.mail}
            onChange={(e) => setCliente(prev => ({ ...prev, mail: e.target.value }))}
            required
          />
          <textarea
            placeholder="Comentario"
            value={cliente.comentario}
            onChange={(e) => setCliente(prev => ({ ...prev, comentario: e.target.value }))}
          />
        </div>

        <div className="form-section">
          <h3>Detalles de la Venta</h3>
          <div className="producto-seleccion">
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
            >
              <option value="">Seleccionar Producto</option>
              {productos.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - ${producto.precio}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={cantidadProducto}
              onChange={(e) => setCantidadProducto(parseInt(e.target.value))}
              className="cantidad-input"
            />
            <button type="button" onClick={agregarProducto}>Agregar Producto</button>
          </div>

          <div className="productos-lista">
            <table className="productos-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {venta.productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.subtotal}</td>
                    <td>
                      <button 
                        type="button" 
                        onClick={() => eliminarProducto(index)}
                        className="eliminar-btn"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="venta-detalles">
            <div className="total-section">
              <h4>Resumen de la Venta</h4>
              <p className="precio-total">Precio Total: ${venta.precioTotal.toFixed(2)}</p>
              <div className="precio-final-input">
                <label htmlFor="precioFinal">Precio Final (con descuentos):</label>
                <input
                  type="number"
                  id="precioFinal"
                  min="0"
                  step="0.01"
                  value={venta.precioFinal}
                  onChange={handlePrecioFinalChange}
                  placeholder="Ingrese el precio final"
                />
              </div>
            </div>
            
            <select
              value={venta.medioPago}
              onChange={(e) => handleMedioPagoChange(e.target.value)}
              required
            >
              <option value="">Seleccionar Medio de Pago</option>
              {mediosPago.map(medio => (
                <option key={medio.id} value={medio.id}>{medio.nombre}</option>
              ))}
            </select>

            {medioPagoSeleccionado?.permiteCuotas && (
              <div className="cuotas-container">
                <label>Número de Cuotas:</label>
                <input
                  type="number"
                  min="1"
                  max={medioPagoSeleccionado.maxCuotas}
                  value={venta.cuotas}
                  onChange={(e) => setVenta(prev => ({ ...prev, cuotas: parseInt(e.target.value) }))}
                  required
                />
                <small>Máximo {medioPagoSeleccionado.maxCuotas} cuotas</small>
                <p className="valor-cuota">
                  Valor por cuota: ${(venta.precioTotal / venta.cuotas).toFixed(2)}
                </p>
              </div>
            )}

            <input
              type="date"
              value={venta.fecha}
              onChange={(e) => setVenta(prev => ({ ...prev, fecha: e.target.value }))}
              required
            />
          </div>
        </div>

        <button type="submit" className="guardar-venta">Guardar Venta</button>
      </form>
    </div>
  )
}

function App() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [compras, setCompras] = useState([])
  const [mediosPago, setMediosPago] = useState([])
  const [clientesCombinados, setClientesCombinados] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vistaActual, setVistaActual] = useState('lista')
  const [cambiosPendientes, setCambiosPendientes] = useState(false)

  // Función para generar un ID único
  const generarId = (tipo) => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${tipo}-${timestamp}-${random}`
  }

  const guardarCambios = async () => {
    try {
      // Obtener el token del entorno
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const repository = 'javtr/front-bd';

      if (!token) {
        console.error('Token no encontrado:', import.meta.env);
        throw new Error('No se encontró el token de GitHub. Por favor, verifica la configuración.');
      }

      // Preparar los datos para enviar
      const clientesData = JSON.stringify(clientes, null, 2);
      const comprasData = JSON.stringify(compras, null, 2);

      // Enviar los datos al GitHub Action
      const response = await fetch(
        `https://api.github.com/repos/${repository}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'update_data',
            client_payload: {
              clientes: clientesData,
              compras: comprasData
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de GitHub:', errorData);
        throw new Error(`Error al enviar los datos a GitHub: ${errorData.message || response.statusText}`);
      }

      setCambiosPendientes(false);
      alert('Los archivos han sido actualizados correctamente. Los cambios se reflejarán en unos momentos.');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError('Error al guardar los cambios: ' + error.message);
      alert('Error al guardar los cambios. Por favor, intente nuevamente.');
    }
  }

  // Función para cargar los datos
  const cargarDatos = async () => {
    try {
      const [clientesRes, productosRes, comprasRes, mediosPagoRes] = await Promise.all([
        fetch(`${CONFIG.DATA_URL}/${CONFIG.FILES.CLIENTES}`),
        fetch(`${CONFIG.DATA_URL}/${CONFIG.FILES.PRODUCTOS}`),
        fetch(`${CONFIG.DATA_URL}/${CONFIG.FILES.COMPRAS}`),
        fetch(`${CONFIG.DATA_URL}/${CONFIG.FILES.MEDIOS_PAGO}`)
      ]);

      const clientesData = await clientesRes.json();
      const productosData = await productosRes.json();
      const comprasData = await comprasRes.json();
      const mediosPagoData = await mediosPagoRes.json();

      // Ordenar compras por fecha (más recientes primero)
      const comprasOrdenadas = comprasData.sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );

      setClientes(clientesData);
      setProductos(productosData);
      setCompras(comprasOrdenadas);
      setMediosPago(mediosPagoData.mediosPago);

      // Combinar la información
      const combinados = clientesData.map(cliente => {
        const clienteActualizado = { ...cliente };
        const comprasCliente = comprasOrdenadas.filter(compra => compra.cliente === cliente.id);
        clienteActualizado.compras = comprasCliente.map(compra => {
          const productosComprados = compra.productos.map(productoId => 
            productosData.find(p => p.id === productoId)
          ).filter(Boolean);
          return { ...compra, productos: productosComprados };
        });
        return clienteActualizado;
      });

      setClientesCombinados(combinados);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
      setIsLoading(false);
    }
  }

  const guardarNuevaVenta = (datosVenta) => {
    try {
      const { cliente, venta } = datosVenta

      // Crear nuevo cliente
      const nuevoCliente = {
        id: generarId('cliente'),
        nombre: cliente.nombre,
        mail: cliente.mail,
        idmachine: cliente.id,
        comentario: cliente.comentario
      }

      // Crear nueva compra
      const nuevaCompra = {
        id: generarId('compra'),
        cliente: nuevoCliente.id,
        fecha: venta.fecha,
        productos: venta.productos.map(p => p.id),
        medioPago: venta.medioPago,
        cuotas: venta.cuotas,
        precioTotal: venta.precioFinal || venta.precioTotal
      }

      // Actualizar los datos en memoria
      const clientesActualizados = [...clientes, nuevoCliente]
      const comprasActualizadas = [nuevaCompra, ...compras] // Agregar al inicio para mantener orden

      // Actualizar el estado
      setClientes(clientesActualizados)
      setCompras(comprasActualizadas)
      setCambiosPendientes(true)

      // Actualizar clientesCombinados
      const combinados = clientesActualizados.map(cliente => {
        const clienteActualizado = { ...cliente }
        const comprasCliente = comprasActualizadas.filter(compra => compra.cliente === cliente.id)
        clienteActualizado.compras = comprasCliente.map(compra => {
          const productosComprados = compra.productos.map(productoId => 
            productos.find(p => p.id === productoId)
          ).filter(Boolean)
          return { ...compra, productos: productosComprados }
        })
        return clienteActualizado
      })

      setClientesCombinados(combinados)
      setVistaActual('lista')
      alert('Venta guardada exitosamente. Recuerde guardar los cambios en los archivos JSON.')
    } catch (error) {
      console.error('Error en guardarNuevaVenta:', error)
      setError('Error al procesar la venta: ' + error.message)
      alert('Error al procesar la venta. Por favor, intente nuevamente.')
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  if (isLoading) {
    return <div className="loading">Cargando datos...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="container">
      <h1>Registro de Ventas</h1>
      
      <div className="navigation">
        <button 
          className={vistaActual === 'lista' ? 'active' : ''} 
          onClick={() => setVistaActual('lista')}
        >
          Ver Lista de Ventas
        </button>
        <button 
          className={vistaActual === 'nueva' ? 'active' : ''} 
          onClick={() => setVistaActual('nueva')}
        >
          Nueva Venta
        </button>
      </div>

      {vistaActual === 'lista' ? (
        <>
          <div className="button-group">
            {cambiosPendientes && (
              <button 
                onClick={guardarCambios}
                className="guardar-cambios"
              >
                Guardar Cambios en JSON
              </button>
            )}
          </div>

          <div className="data-section">
            <h2>Ventas Recientes</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Medio de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesCombinados.map(cliente => 
                    cliente.compras.map(compra => (
                      <tr key={compra.id}>
                        <td>{compra.fecha}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.mail}</td>
                        <td>
                          {compra.productos.map(p => p.nombre).join(', ')}
                        </td>
                        <td>${compra.precioTotal}</td>
                        <td>
                          {mediosPago.find(mp => mp.id === compra.medioPago)?.nombre || compra.medioPago}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <NuevaVenta 
          productos={productos} 
          mediosPago={mediosPago}
          onGuardarVenta={guardarNuevaVenta}
        />
      )}
    </div>
  )
}

export default App
