import { render, screen, userEvent, act } from "@/test/utils";
import { WidgetConfigDialog } from "./WidgetConfigDialog";

describe("WidgetConfigDialog", () => {
  it("renders and calls onSave when Save clicked", async () => {
    const widget = { id: "1", type: "test", position: 0, visible: true };
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(
      <WidgetConfigDialog
        widget={widget}
        isOpen
        onClose={onClose}
        onSave={onSave}
      />
    );
    expect(screen.getByText("Configure Widget")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByText("Save"));
    });
    expect(onSave).toHaveBeenCalledWith(widget);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Cancel clicked", async () => {
    const onClose = vi.fn();
    render(
      <WidgetConfigDialog
        widget={{ id: "1", type: "x", position: 0, visible: true }}
        isOpen
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    await act(async () => {
      await userEvent.click(screen.getByText("Cancel"));
    });
    expect(onClose).toHaveBeenCalled();
  });
});
