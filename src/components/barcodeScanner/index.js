import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Platform,
  Text,
  StyleSheet,
  View,
  Linking,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from "react-native-vision-camera";

/**
 * BarcodeScanner
 * ----------------------------------------------------------------------------
 * Shared barcode/QR scanner built on react-native-vision-camera. Designed to
 * be dropped inside a Modal (or full-screen view) by any field component that
 * needs to capture a scanned value.
 *
 * USAGE:
 *
 *   <Modal visible={open} onRequestClose={close}>
 *     <BarcodeScanner
 *       onScanned={(value) => { updateField(value); close(); }}
 *       onClose={close}
 *     />
 *   </Modal>
 *
 * PROPS:
 *
 *   onScanned: (value: string) => void
 *     Called ONCE per mount when the first valid code is detected. Implements
 *     internal debouncing because the underlying onCodeScanned fires many
 *     times per second while a barcode is in view.
 *
 *   onClose: () => void
 *     Called when the user taps the close (X) button or denies camera
 *     permission.
 *
 *   codeTypes?: string[]
 *     Optional override for which barcode formats to scan. Defaults to a
 *     broad set (QR + most retail/shipping barcodes) matching the original
 *     react-native-camera behavior. Pass a narrower set for performance.
 *     See: https://react-native-vision-camera.com/docs/api#codetype
 *
 *   showTorchButton?: boolean   (default true)
 *   showReticle?: boolean       (default true)
 *   helpText?: string           (default "Align the barcode within the frame")
 *
 * BEHAVIOR NOTES:
 *
 *   - The camera mounts on first render and unmounts when the parent unmounts
 *     the component (typically when the modal closes). The camera device
 *     handle is released on unmount.
 *
 *   - Permission is requested on mount if not already granted. Denial routes
 *     the user to Settings via an Alert.
 *
 *   - One scan per mount. If you need continuous scanning (multi-item
 *     capture into a list), reset by remounting the component, or fork this
 *     file and remove the hasScanned guard.
 * ----------------------------------------------------------------------------
 */
const DEFAULT_CODE_TYPES = [
  "qr",
  "ean-13",
  "ean-8",
  "code-128",
  "code-39",
  "code-93",
  "codabar",
  "itf",
  "upc-e",
  "pdf-417",
  "aztec",
  "data-matrix",
];

const BarcodeScanner = ({
  onScanned,
  onClose,
  codeTypes = DEFAULT_CODE_TYPES,
  showTorchButton = true,
  showReticle = true,
  helpText = "Align the barcode within the frame",
}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [hasScanned, setHasScanned] = useState(false);
  const [torch, setTorch] = useState("off");

  // Request permission on mount if needed.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted && !cancelled) {
          Alert.alert(
            "Camera permission required",
            "Please grant camera permission to scan barcodes.",
            [
              { text: "Cancel", style: "cancel", onPress: onClose },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasPermission, requestPermission, onClose]);

  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: (codes) => {
      if (hasScanned) return; // debounce — onCodeScanned can fire many times
      const first = codes.find((c) => c.value);
      if (first?.value) {
        setHasScanned(true);
        onScanned(first.value);
      }
    },
  });

  // Loading / permission-pending states.
  if (!device) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>
          {hasPermission
            ? "Initializing camera…"
            : "Awaiting camera permission…"}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="times" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Camera permission required</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="times" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        torch={torch}
      />

      {showReticle && (
        <View pointerEvents="none" style={styles.overlay}>
          <View style={styles.reticle} />
          {helpText ? <Text style={styles.helpText}>{helpText}</Text> : null}
        </View>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="times" size={20} color="#ffffff" />
      </TouchableOpacity>

      {showTorchButton && (
        <TouchableOpacity
          style={styles.torchButton}
          onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
          accessibilityLabel={torch === "on" ? "Turn flashlight off" : "Turn flashlight on"}
        >
          <Icon
            name="lightbulb-o"
            size={20}
            color={torch === "on" ? "#ffd54f" : "#ffffff"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  fallback: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  reticle: {
    width: 260,
    height: 260,
    borderColor: "rgba(255,255,255,0.85)",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  helpText: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 24,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  torchButton: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BarcodeScanner;