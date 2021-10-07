    <script type="module">
        import { LeitorQRCode } from "./LeitorQRCode.js";
        window.leitorQRCode = new LeitorQRCode();
        window.addEventListener("beforeunload", (evento) => {
            if (window.leitorQRCode.leitorAtivo()){
                window.leitorQRCode.pararLeitor();
            }
        });      
    </script>
