"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export const DialogAlertContext = createContext(null);

export const alert = {
  /**
   *
   * @param {{ title: string, description: string, buttonText: string, onClose: function, secondaryButtonText: string}} config
   */
  close: (config) => {},
  /**
   *
   * @param {{ title: string, description: string, buttonText: string, onClose: function, secondaryButtonText: string}} config
   */
  success: (config) => {},
  /**
   *
   * @param {{ title: string, description: string, buttonText: string, onClose: function, secondaryButtonText: string}} config
   */
  error: (config) => {},
  /**
   *
   * @param {{ title: string, description: string, buttonText: string, onClose: function, secondaryButtonText: string}} config
   */
  warning: (config) => {},
  /**
   *
   * @param {{ title: string, description: string, buttonText: string, onClose: function, secondaryButtonText: string}} config
   */
  info: (config) => {},
  /**
   *
   * @param {{ title: string, description: string, buttonText: string, onClose: function, secondaryButtonText: string}} config
   */
  confirm: (config) => Promise.reject(new Error("Alert not initialized")),
};

window.alerter = alert;

export function DialogAlertProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("info");
  const [config, setConfig] = useState({
    title: "",
    description: "",
    buttonText: "",
    onClose: null,
    secondaryButtonText: "",
  });

  const triggerAlert = useCallback((alertType, options) => {
    setType(alertType);
    setConfig(options);
    setIsOpen(true);
  }, []);

  const success = useCallback(
    (options) => triggerAlert("success", options),
    [triggerAlert],
  );
  const error = useCallback(
    (options) => triggerAlert("error", options),
    [triggerAlert],
  );
  const warning = useCallback(
    (options) => triggerAlert("warning", options),
    [triggerAlert],
  );
  const info = useCallback(
    (options) => triggerAlert("info", options),
    [triggerAlert],
  );
  const close = useCallback((options) => {
    setIsOpen(false);
    if (options && typeof options.onClose === "function") {
      options.onClose(options.confirmed);
    }
  }, []);

  const confirm = useCallback(
    (options) => {
      return new Promise((resolve, reject) => {
        try {
          triggerAlert("confirm", {
            ...options,

            onClose: (confirmed) => {
              setIsOpen(false);
              if (confirmed) {
                resolve(true);
              } else {
                resolve(false);
              }
            },
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    [triggerAlert],
  );

  const styles = {
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      btnClass: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      btnClass: "bg-destructive hover:bg-destructive/90",
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      btnClass: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      btnClass: "bg-blue-600 hover:bg-blue-700",
    },
    confirm: {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      btnClass: "bg-blue-600 hover:bg-blue-700",
    },
  };

  useEffect(() => {
    alert.success = success;
    alert.error = error;
    alert.warning = warning;
    alert.info = info;
    alert.confirm = confirm;
    alert.close = close;
  }, [success, error, warning, info, confirm, close]);

  return (
    <DialogAlertContext.Provider
      value={{ success, error, warning, info, close, confirm }}
    >
      {children}
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center p-6 text-center">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="mb-2">{styles[type].icon}</div>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {config.title}
            </DialogTitle>
            {config.description && (
              <DialogDescription className="text-sm text-muted-foreground max-w-xs">
                {config.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="w-full mt-4 sm:justify-center">
            {config.secondaryButtonText && (
              <Button
                className={`w-full sm:w-28`}
                variant="outline"
                onClick={() => {
                  close({
                    confirmed: false,
                    ...config,
                  });
                }}
              >
                {config.secondaryButtonText || "Cancel"}
              </Button>
            )}
            <Button
              className={`w-full sm:w-28 text-white ${styles[type].btnClass}`}
              onClick={() => {
                close({
                  confirmed: true,
                  ...config,
                });
              }}
            >
              {config.buttonText || config.secondaryButtonText ? "OK" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/10 sm:mx-0">
                {styles[type].icon}
              </div>
              {config.title}
            </AlertDialogTitle>
            {config.description && (
              <AlertDialogDescription className="text-[15px]">
                {config.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {config.secondaryButtonText && (
              <AlertDialogCancel
                onClick={() => {
                  close({
                    confirmed: false,
                    ...config,
                  });
                }}
              >
                {config.secondaryButtonText || "Cancel"}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              // className={styles[type].btnClass}
              onClick={() => {
                close({
                  confirmed: true,
                  ...config,
                });
              }}
            >
              {config.buttonText || config.secondaryButtonText ? "OK" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogAlertContext.Provider>
  );
}

export const useDialogAlert = () => {
  const context = useContext(DialogAlertContext);
  if (!context) {
    throw new Error("useDialogAlert must be used within a DialogAlertProvider");
  }
  return context;
};
