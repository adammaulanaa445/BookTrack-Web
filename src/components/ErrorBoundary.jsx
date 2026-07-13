import { Component } from "react";
import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("BookTrack ErrorBoundary menangkap error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-stone-50 dark:bg-zinc-950">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-950/40">
              <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
              Ada yang salah
            </h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Terjadi kesalahan tak terduga di halaman ini. Data favorit dan bacaanmu tetap aman tersimpan.
            </p>

            {this.state.error && (
              <p className="mt-3 text-xs font-mono text-stone-400 dark:text-stone-600 break-words">
                {this.state.error.message}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium bg-emerald-800 hover:bg-emerald-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
              >
                <RotateCcw className="w-4 h-4" /> Coba Lagi
              </button>
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <RefreshCw className="w-4 h-4" /> Muat Ulang ke Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}