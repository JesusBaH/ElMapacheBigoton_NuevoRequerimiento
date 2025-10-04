import { useRef, useState, useEffect } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import type { MenuItem } from 'primereact/menuitem';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import type { Nullable } from "primereact/ts-helpers";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from "primereact/utils";
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import BarberoService from '../Services/BarberoService';
import ServicioService from '../Services/ServicioService';
import ClienteService from '../Services/ClienteService';
import CitaService from '../Services/CitaService';
import SucursalService from "../Services/SucursalService.tsx";

interface Barbero {
    idBarbero: number | null;
    nombre: string;
}

interface Servicio {
    idServicio: number | null;
    descripcion: string;
    costo: number;
}

interface Sucursal {
    idSucursal: number | null;
    direccion: string;
}

interface Cliente {
    nombre: string;
    telefono: string;
}

interface FormattedBarbero {
    idBarbero: number | null;
    nombreBarbero: string;
}

interface FormattedServicio {
    idServicio: number | null;
    nombreServicio: string;
}

interface FormattedSucursal {
    idSucursal: number | null;
    nombreSucursal: string;
}

interface Cita {
    idCita: number;
    fecha: string;
    hora: string;
    barbero: {
        idBarbero: number;
        nombre: string;
    };
    cliente: {
        idCliente: number;
        nombre: string;
        telefono: string;
    };
    servicio: {
        idServicio: number;
        descripcion: string;
        costo: number;
    };
    sucursal: {
        idSucursal: number;
        direccion: string;
    };
}

interface CalendarDate {
    day: number;
    month: number;
    year: number;
    today: boolean;
    selectable: boolean;
}

export default function SidebarDemo() {
    const toast = useRef<Toast>(null);
    const [date, setDate] = useState<Nullable<Date>>(null);
    const [selectedDate, setSelectedDate] = useState<Nullable<Date>>(null);
    const [barberos, setBarberos] = useState<FormattedBarbero[]>([]);
    const [servicios, setServicios] = useState<FormattedServicio[]>([]);
    const [sucursales, setSucursales] = useState<FormattedSucursal[]>([]);
    const [selectedBarbero, setSelectedBarbero] = useState<FormattedBarbero | null>(null);
    const [selectedServicio, setSelectedServicio] = useState<FormattedServicio | null>(null);
    const [selectedSucursal, setSelectedSucursal] = useState<FormattedSucursal | null>(null);
    const [cliente, setCliente] = useState<Cliente>({ nombre: '', telefono: '' });
    const [hora, setHora] = useState<Nullable<Date>>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [citas, setCitas] = useState<Cita[]>([]);
    const [citasDelDia, setCitasDelDia] = useState<Cita[]>([]);
    const [showCitasDialog, setShowCitasDialog] = useState<boolean>(false);
    const [fechasConCitas, setFechasConCitas] = useState<string[]>([]);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const [citaAEditar, setCitaAEditar] = useState<Cita | null>(null);
    const [barberosDisponibles, setBarberosDisponibles] = useState<FormattedBarbero[]>([]);
    const [editData, setEditData] = useState({
        barbero: null as FormattedBarbero | null,
        servicio: null as FormattedServicio | null,
        sucursal: null as FormattedSucursal | null,
        cliente: { nombre: '', telefono: '' },
        fecha: null as Nullable<Date>,
        hora: null as Nullable<Date>
    });

    const items: MenuItem[] = [
        { label: 'Agenda', icon: 'pi pi-calendar' },
        { label: 'Cátalogos', icon: 'pi pi-pen-to-square' , url: '/catalogos' },
    ];

    const loadCitas = async () => {
        try {
            const response = await CitaService.findAll();
            if (response && response.data && Array.isArray(response.data)) {
                setCitas(response.data);
                const fechas = [...new Set(response.data.map((cita: Cita) => cita.fecha))];
                setFechasConCitas(fechas);
            } else {
                setCitas([]);
                setFechasConCitas([]);
            }
        } catch (error) {
            console.error("Error al cargar las citas:", error);
            setCitas([]);
            setFechasConCitas([]);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [serviciosResponse, sucursalesResponse] = await Promise.all([
                    ServicioService.findAll(),
                    SucursalService.findAll()
                ]);

                setServicios(serviciosResponse.data.map((s: Servicio) => ({
                    idServicio: s.idServicio,
                    nombreServicio: s.descripcion
                })));

                setSucursales(sucursalesResponse.data.map((s: Sucursal) => ({
                    idSucursal: s.idSucursal,
                    nombreSucursal: s.direccion
                })));
            } catch (error) {
                console.error("Error al cargar los datos iniciales:", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los datos iniciales.',
                    life: 5000
                });
            }
        };


        loadInitialData();
        loadCitas();
    }, []);

    const fetchBarberosPorSucursal = async (sucursalId: number) => {
        try {
            const response = await BarberoService.findBySucursal(sucursalId);
            if (response.data && Array.isArray(response.data)) {
                const formattedBarberos = response.data.map((b: Barbero) => ({
                    idBarbero: b.idBarbero,
                    nombreBarbero: b.nombre
                }));
                return formattedBarberos;
            }
        } catch (error) {
            console.error("Error al buscar barberos por sucursal", error);
        }
        return [];
    };

    const onSucursalChange = async (sucursal: FormattedSucursal | null) => {
        setSelectedSucursal(sucursal);
        setSelectedBarbero(null);
        if (sucursal && sucursal.idSucursal) {
            const barberosFetched = await fetchBarberosPorSucursal(sucursal.idSucursal);
            setBarberosDisponibles(barberosFetched);
        } else {
            setBarberosDisponibles([]);
        }
    };

    const onEditSucursalChange = async (sucursal: FormattedSucursal | null) => {
        setEditData(prevData => ({ ...prevData, sucursal: sucursal, barbero: null }));
        if (sucursal && sucursal.idSucursal) {
            const barberosFetched = await fetchBarberosPorSucursal(sucursal.idSucursal);
            setBarberos(barberosFetched);
        } else {
            setBarberos([]);
        }
    };

    const handleAgendarCita = async () => {
        setSubmitted(true);
        if (!selectedBarbero || !selectedServicio || !selectedSucursal || !cliente.nombre.trim() || !cliente.telefono.trim() || !selectedDate || !hora) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
            return;
        }

        try {
            const clientResponse = await ClienteService.create({
                nombre: cliente.nombre,
                telefono: cliente.telefono
            });
            const idCliente = clientResponse.data.idCliente;

            const nuevaCita = {
                fecha: selectedDate.toISOString().split('T')[0],
                hora: hora.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                barbero: {
                    idBarbero: selectedBarbero.idBarbero,
                    nombre: selectedBarbero.nombreBarbero
                },
                servicio: {
                    idServicio: selectedServicio.idServicio,
                    descripcion: selectedServicio.nombreServicio
                },
                sucursal: {
                    idSucursal: selectedSucursal.idSucursal,
                    direccion: selectedSucursal.nombreSucursal
                },
                cliente: {
                    idCliente: idCliente
                }
            };

            await CitaService.create(nuevaCita);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita agendada correctamente.', life: 3000 });

            setSelectedBarbero(null);
            setSelectedServicio(null);
            setSelectedSucursal(null);
            setCliente({ nombre: '', telefono: '' });
            setSelectedDate(null);
            setHora(null);
            setSubmitted(false);
            setBarberosDisponibles([]);

            await loadCitas();

        } catch (error) {
            console.error("Error al agendar la cita:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo agendar la cita. Intente de nuevo.', life: 3000 });
        }
    };

    const handleEditarCita = async (cita: Cita) => {
        const sucursalFormateada = sucursales.find(s => s.idSucursal === cita.sucursal.idSucursal) || null;
        if (sucursalFormateada && sucursalFormateada.idSucursal) {
            const barberosFetched = await fetchBarberosPorSucursal(sucursalFormateada.idSucursal);
            setBarberos(barberosFetched);
        }

        setCitaAEditar(cita);

        const barberoFormateado = { idBarbero: cita.barbero.idBarbero, nombreBarbero: cita.barbero.nombre };
        const servicioFormateado = servicios.find(s => s.idServicio === cita.servicio.idServicio);

        const fechaCita = new Date(cita.fecha + 'T00:00:00');
        const [horas, minutos] = cita.hora.split(':');
        const horaCita = new Date();
        horaCita.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0, 0);

        setEditData({
            barbero: barberoFormateado || null,
            servicio: servicioFormateado || null,
            sucursal: sucursalFormateada,
            cliente: { ...cita.cliente },
            fecha: fechaCita,
            hora: horaCita
        });
        setShowEditDialog(true);
    };

    const handleActualizarCita = async () => {
        if (!citaAEditar || !editData.barbero || !editData.servicio || !editData.sucursal || !editData.cliente.nombre.trim() || !editData.cliente.telefono.trim() || !editData.fecha || !editData.hora) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
            return;
        }

        try {
            await ClienteService.update(citaAEditar.cliente.idCliente, {
                idCliente: citaAEditar.cliente.idCliente,
                nombre: editData.cliente.nombre,
                telefono: editData.cliente.telefono
            });

            const citaActualizada = {
                idCita: citaAEditar.idCita,
                fecha: editData.fecha.toISOString().split('T')[0],
                hora: editData.hora.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                barbero: {
                    idBarbero: editData.barbero.idBarbero,
                    nombre: editData.barbero.nombreBarbero
                },
                servicio: {
                    idServicio: editData.servicio.idServicio,
                    descripcion: editData.servicio.nombreServicio
                },
                sucursal: {
                    idSucursal: editData.sucursal.idSucursal,
                    direccion: editData.sucursal.nombreSucursal
                },
                cliente: {
                    idCliente: citaAEditar.cliente.idCliente,
                    nombre: editData.cliente.nombre,
                    telefono: editData.cliente.telefono
                }
            };

            await CitaService.update(citaAEditar.idCita, citaActualizada);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita actualizada correctamente.', life: 3000 });
            setShowEditDialog(false);
            setCitaAEditar(null);
            await loadCitas();

            const fechaString = citaActualizada.fecha;
            const citasDelDiaActualizadas = citas.filter(c => c.fecha === fechaString);
            setCitasDelDia(citasDelDiaActualizadas);

        } catch (error) {
            console.error("Error al actualizar la cita:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la cita.', life: 3000 });
        }
    };

    const handleEliminarCita = (cita: Cita) => {
        confirmDialog({
            message: `¿Está seguro de eliminar la cita de ${cita.cliente.nombre} a las ${cita.hora}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await CitaService.delete(cita.idCita);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita eliminada correctamente.', life: 3000 });

                    const citasActualizadas = citas.filter(c => c.idCita !== cita.idCita);
                    setCitas(citasActualizadas);

                    const citasDelDiaActualizadas = citasDelDia.filter(c => c.idCita !== cita.idCita);
                    setCitasDelDia(citasDelDiaActualizadas);

                    if (citasDelDiaActualizadas.length === 0) {
                        const fechasActualizadas = [...new Set(citasActualizadas.map(c => c.fecha))];
                        setFechasConCitas(fechasActualizadas);
                        setShowCitasDialog(false);
                    }
                } catch (error) {
                    console.error("Error al eliminar la cita:", error);
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la cita.', life: 3000 });
                }
            }
        });
    };

    const dateTemplate = (date: CalendarDate) => {
        const fechaString = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        const tieneCitas = fechasConCitas.includes(fechaString);
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <span>{date.day}</span>
                {tieneCitas && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', border: '1px solid white' }} />
                )}
            </div>
        );
    };

    const handleDateSelect = (e: { value: Nullable<Date> }) => {
        const fechaSeleccionada = e.value;
        setDate(fechaSeleccionada);
        setSelectedDate(fechaSeleccionada);

        if (fechaSeleccionada) {
            const fechaString = fechaSeleccionada.toISOString().split('T')[0];
            const citasDelDiaSeleccionado = citas.filter(cita => cita.fecha === fechaString);
            if (citasDelDiaSeleccionado.length > 0) {
                setCitasDelDia(citasDelDiaSeleccionado);
                setShowCitasDialog(true);
            }
        }
    };

    const horaBodyTemplate = (rowData: Cita) => <span>{rowData.hora}</span>;
    const barberoBodyTemplate = (rowData: Cita) => <span>{rowData.barbero.nombre}</span>;
    const sucursalBodyTemplate = (rowData: Cita) => <span>{rowData.sucursal.direccion}</span>;
    const clienteBodyTemplate = (rowData: Cita) => (
        <div>
            <div style={{ fontWeight: 'bold' }}>{rowData.cliente.nombre}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{rowData.cliente.telefono}</div>
        </div>
    );
    const servicioBodyTemplate = (rowData: Cita) => (
        <div>
            <div>{rowData.servicio.descripcion}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>${rowData.servicio.costo}</div>
        </div>
    );
    const accionesBodyTemplate = (rowData: Cita) => (
        <div className="flex gap-2 justify-content-center">
            <Button icon="pi pi-pencil" rounded outlined className="p-button-success" onClick={() => handleEditarCita(rowData)} tooltip="Editar cita" />
            <Button icon="pi pi-trash" rounded outlined className="p-button-danger" onClick={() => handleEliminarCita(rowData)} tooltip="Eliminar cita" />
        </div>
    );

    const citasDialogFooter = <Button label="Cerrar" icon="pi pi-times" onClick={() => setShowCitasDialog(false)} className="p-button-text" />;
    const editDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={() => setShowEditDialog(false)} />
            <Button label="Actualizar" icon="pi pi-check" onClick={handleActualizarCita} />
        </>
    );

    return (
        <div style={{ display: 'flex' }}>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '1px solid #ccc', zIndex: 1000 }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>🦝 El Mapache Bigotón 💈</span>
                <i className="pi pi-bell" style={{ fontSize: '1.5rem' }}></i>
            </div>
            <div style={{ width: '250px', borderRight: '1px solid #ccc', height: '100vh', overflowY: 'auto', position: 'fixed', top: '60px', left: 0, padding: '1rem' }}>
                <PanelMenu model={items} style={{ width: '100%' }} />
            </div>
            <div style={{ flexGrow: 1, marginLeft: '250px', marginTop: '60px', padding: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                <div style={{ width: '750px', height: '560px' }}>
                    <Calendar value={date} onChange={handleDateSelect} inline showWeek dateTemplate={dateTemplate} style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ width: '320px' }}>
                    <Card title="Nueva Cita">
                        <div className="p-fluid" style={{ padding: '0.5rem' }}>
                            <div className="field mb-3">
                                <label htmlFor="sucursal" className="font-bold">Sucursal</label>
                                <Dropdown id="sucursal" value={selectedSucursal} onChange={(e) => onSucursalChange(e.value)} options={sucursales} optionLabel="nombreSucursal" placeholder="Selecciona una sucursal" className={classNames({'p-invalid': submitted && !selectedSucursal})} />
                                {submitted && !selectedSucursal && <small className="p-error">La sucursal es requerida.</small>}
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="barbero" className="font-bold">Barbero</label>
                                <Dropdown id="barbero" value={selectedBarbero} onChange={(e) => setSelectedBarbero(e.value)} options={barberosDisponibles} optionLabel="nombreBarbero" placeholder="Selecciona un barbero" disabled={!selectedSucursal} className={classNames({'p-invalid': submitted && !selectedBarbero})} />
                                {submitted && !selectedBarbero && <small className="p-error">El barbero es requerido.</small>}
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="servicio" className="font-bold">Servicio</label>
                                <Dropdown id="servicio" value={selectedServicio} onChange={(e) => setSelectedServicio(e.value)} options={servicios} optionLabel="nombreServicio" placeholder="Selecciona un servicio" className={classNames({'p-invalid': submitted && !selectedServicio})} />
                                {submitted && !selectedServicio && <small className="p-error">El servicio es requerido.</small>}
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="nombreCliente" className="font-bold">Nombre del Cliente</label>
                                <InputText id="nombreCliente" value={cliente.nombre} onChange={(e) => setCliente({...cliente, nombre: e.target.value})} placeholder="Nombre del cliente" className={classNames({'p-invalid': submitted && !cliente.nombre.trim()})} />
                                {submitted && !cliente.nombre.trim() && <small className="p-error">El nombre es requerido.</small>}
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="telefono" className="font-bold">Teléfono del Cliente</label>
                                <InputText id="telefono" type="tel" value={cliente.telefono} onChange={(e) => setCliente({...cliente, telefono: e.target.value})} placeholder="Teléfono del cliente" className={classNames({'p-invalid': submitted && !cliente.telefono.trim()})} />
                                {submitted && !cliente.telefono.trim() && <small className="p-error">El teléfono es requerido.</small>}
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fecha" className="font-bold">Fecha de la Cita</label>
                                <Calendar id="fecha" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} dateFormat="dd/M/yy" readOnlyInput className={classNames({'p-invalid': submitted && !selectedDate})} />
                                {submitted && !selectedDate && <small className="p-error">La fecha es requerida.</small>}
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="hora" className="font-bold">Hora de la Cita</label>
                                <Calendar id="hora" value={hora} onChange={(e) => setHora(e.value)} timeOnly hourFormat="12" className={classNames({'p-invalid': submitted && !hora})} />
                                {submitted && !hora && <small className="p-error">La hora es requerida.</small>}
                            </div>
                            <div className="text-center mt-2">
                                <Button label="Agendar Cita" icon="pi pi-check" onClick={handleAgendarCita} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Dialog visible={showCitasDialog} style={{ width: '80vw', maxWidth: '1000px' }} header={<div className="flex align-items-center gap-2"><i className="pi pi-calendar" style={{ color: '#10b981' }}></i><span style={{ color: '#333', fontWeight: '600' }}>Citas del {selectedDate?.toLocaleDateString('es-MX')}</span></div>} modal footer={citasDialogFooter} onHide={() => setShowCitasDialog(false)}>
                <DataTable value={citasDelDia} responsiveLayout="scroll" emptyMessage="No hay citas para este día">
                    <Column field="hora" header="Hora" body={horaBodyTemplate} style={{ minWidth: '100px' }} />
                    <Column field="sucursal.direccion" header="Sucursal" body={sucursalBodyTemplate} style={{ minWidth: '180px' }} />
                    <Column field="barbero.nombre" header="Barbero" body={barberoBodyTemplate} style={{ minWidth: '150px' }} />
                    <Column field="cliente" header="Cliente" body={clienteBodyTemplate} style={{ minWidth: '180px' }} />
                    <Column field="servicio" header="Servicio" body={servicioBodyTemplate} style={{ minWidth: '180px' }} />
                    <Column header="Acciones" body={accionesBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />
                </DataTable>
            </Dialog>
            <Dialog visible={showEditDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Editar Cita" modal className="p-fluid" footer={editDialogFooter} onHide={() => setShowEditDialog(false)}>
                <div className="field mb-3">
                    <label htmlFor="edit-sucursal" className="font-bold">Sucursal</label>
                    <Dropdown id="edit-sucursal" value={editData.sucursal} onChange={(e) => onEditSucursalChange(e.value)} options={sucursales} optionLabel="nombreSucursal" placeholder="Selecciona una sucursal" />
                </div>
                <div className="field mb-3">
                    <label htmlFor="edit-barbero" className="font-bold">Barbero</label>
                    <Dropdown id="edit-barbero" value={editData.barbero} onChange={(e) => setEditData({...editData, barbero: e.value})} options={barberos} optionLabel="nombreBarbero" placeholder="Selecciona un barbero" disabled={!editData.sucursal} />
                </div>
                <div className="field mb-3">
                    <label htmlFor="edit-servicio" className="font-bold">Servicio</label>
                    <Dropdown id="edit-servicio" value={editData.servicio} onChange={(e) => setEditData({...editData, servicio: e.value})} options={servicios} optionLabel="nombreServicio" placeholder="Selecciona un servicio" />
                </div>
                <div className="field mb-3">
                    <label htmlFor="edit-nombre" className="font-bold">Nombre del Cliente</label>
                    <InputText id="edit-nombre" value={editData.cliente.nombre} onChange={(e) => setEditData({ ...editData, cliente: {...editData.cliente, nombre: e.target.value} })} />
                </div>
                <div className="field mb-3">
                    <label htmlFor="edit-telefono" className="font-bold">Teléfono del Cliente</label>
                    <InputText id="edit-telefono" value={editData.cliente.telefono} onChange={(e) => setEditData({ ...editData, cliente: {...editData.cliente, telefono: e.target.value} })} />
                </div>
                <div className="field mb-3">
                    <label htmlFor="edit-fecha" className="font-bold">Fecha de la Cita</label>
                    <Calendar id="edit-fecha" value={editData.fecha} onChange={(e) => setEditData({...editData, fecha: e.value})} dateFormat="dd/M/yy" />
                </div>
                <div className="field mb-3">
                    <label htmlFor="edit-hora" className="font-bold">Hora de la Cita</label>
                    <Calendar id="edit-hora" value={editData.hora} onChange={(e) => setEditData({...editData, hora: e.value})} timeOnly hourFormat="12" />
                </div>
            </Dialog>
        </div>
    );
}