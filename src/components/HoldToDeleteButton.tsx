import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
	onConfirm: () => void | Promise<void>;
	disabled?: boolean;
}

const HOLD_MS = 1200;

// Adaptado de Lucian UX/UI Prompt #003 "Hold to delete" · MIT License (c) 2026 Seokwoooo
// https://lucianlabs.dev/uxui-prompt/#003 — se quitó la vista previa de archivo y el
// estado "Undo" (nuestro borrado es una llamada real e irreversible a la API); se
// conserva el gesto de mantener presionado con relleno rojo y el "shake" cerca de
// completar, como reemplazo de un window.confirm() nativo.
export default function HoldToDeleteButton({ onConfirm, disabled }: Props) {
	const btnRef = useRef<HTMLButtonElement>(null);
	const [isBusy, setBusy] = useState(false);
	const state = useRef({
		p: 0,
		holding: false,
		raf: 0,
		last: 0,
		finished: false,
	});

	useEffect(() => {
		const btn = btnRef.current;
		if (!btn) return;
		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;

		function setFill(p: number) {
			if (!btn) return;
			btn.style.setProperty('--p', p.toFixed(4));
			btn.classList.toggle(
				'is-holding-shake',
				!reduceMotion && state.current.holding && p > 0.55,
			);
		}

		function tick(now: number) {
			const s = state.current;
			const dt = now - (s.last || now);
			s.last = now;
			s.p = s.holding
				? Math.min(1, s.p + dt / HOLD_MS)
				: Math.max(0, s.p - dt / (HOLD_MS / 2.4));
			setFill(s.p);
			if (s.p >= 1 && s.holding) {
				complete();
				return;
			}
			if (s.holding || s.p > 0) s.raf = requestAnimationFrame(tick);
			else {
				s.raf = 0;
				s.last = 0;
			}
		}

		function start() {
			const s = state.current;
			if (s.finished || disabled || isBusy) return;
			s.holding = true;
			btn?.classList.add('is-holding');
			if (!s.raf) {
				s.last = 0;
				s.raf = requestAnimationFrame(tick);
			}
		}

		function stop() {
			const s = state.current;
			s.holding = false;
			btn?.classList.remove('is-holding', 'is-holding-shake');
			if (!s.raf && s.p > 0) s.raf = requestAnimationFrame(tick);
		}

		async function complete() {
			const s = state.current;
			s.holding = false;
			s.finished = true;
			cancelAnimationFrame(s.raf);
			s.raf = 0;
			btn?.classList.remove('is-holding', 'is-holding-shake');
			setBusy(true);
			try {
				await onConfirm();
			} finally {
				// Si el componente sigue montado (p. ej. falló el borrado), se rearma.
				s.finished = false;
				s.p = 0;
				setFill(0);
				setBusy(false);
			}
		}

		const onPointerDown = (e: PointerEvent) => {
			if (e.button === 0) {
				btn.setPointerCapture(e.pointerId);
				start();
			}
		};
		const onPointerUp = () => stop();
		const onContextMenu = (e: Event) => e.preventDefault();
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
				e.preventDefault();
				start();
			}
		};
		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === ' ' || e.key === 'Enter') stop();
		};
		const onClick = (e: Event) => e.preventDefault();

		btn.addEventListener('pointerdown', onPointerDown);
		btn.addEventListener('pointerup', onPointerUp);
		btn.addEventListener('pointercancel', onPointerUp);
		btn.addEventListener('lostpointercapture', onPointerUp);
		btn.addEventListener('contextmenu', onContextMenu);
		btn.addEventListener('keydown', onKeyDown);
		btn.addEventListener('keyup', onKeyUp);
		btn.addEventListener('blur', onPointerUp);
		btn.addEventListener('click', onClick);

		return () => {
			btn.removeEventListener('pointerdown', onPointerDown);
			btn.removeEventListener('pointerup', onPointerUp);
			btn.removeEventListener('pointercancel', onPointerUp);
			btn.removeEventListener('lostpointercapture', onPointerUp);
			btn.removeEventListener('contextmenu', onContextMenu);
			btn.removeEventListener('keydown', onKeyDown);
			btn.removeEventListener('keyup', onKeyUp);
			btn.removeEventListener('blur', onPointerUp);
			btn.removeEventListener('click', onClick);
			cancelAnimationFrame(state.current.raf);
		};
	}, [disabled, isBusy, onConfirm]);

	return (
		<>
			<button
				ref={btnRef}
				type="button"
				disabled={disabled || isBusy}
				aria-label="Mantén presionado para eliminar este enlace"
				class="hold-delete-btn"
			>
				<span class="hold-delete-label">
					{isBusy ? 'Eliminando…' : 'Mantén presionado para eliminar'}
				</span>
				<span class="hold-delete-fill" aria-hidden="true">
					{isBusy ? 'Eliminando…' : 'Mantén presionado para eliminar'}
				</span>
			</button>
			<style>{`
				.hold-delete-btn{--p:0;position:relative;width:100%;height:44px;border:1.5px solid color-mix(in srgb, var(--color-danger) 40%, transparent);border-radius:var(--radius-buttons);padding:0;overflow:hidden;isolation:isolate;background:color-mix(in srgb, var(--color-danger) 12%, var(--color-surface));color:var(--color-danger);touch-action:none;user-select:none;-webkit-user-select:none;font-size:13px;font-weight:600;cursor:pointer;transition:transform .5s var(--ease-standard),opacity .3s}
				.hold-delete-btn:disabled{opacity:.6;cursor:default}
				.hold-delete-btn:focus-visible{outline:2px solid var(--color-danger);outline-offset:3px}
				.hold-delete-label,.hold-delete-fill{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 12px;text-align:center}
				.hold-delete-fill{background:var(--color-danger);color:#fff;clip-path:inset(0 calc(100% - var(--p) * 100%) 0 0)}
				.hold-delete-btn.is-holding{transform:scale(.98)}
				.hold-delete-btn.is-holding-shake{animation:hold-delete-shake .12s linear infinite}
				@keyframes hold-delete-shake{0%,100%{translate:0 0}25%{translate:-1px .5px}75%{translate:1px -.5px}}
			`}</style>
		</>
	);
}
