// Pustaka Template Proses Bisnis KATALIS (BPMN 2.0 Standar)

export const SAMPLE_SIMULATION_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_Katalis_Sim" targetNamespace="http://katalis.mualnudarza.io/schema/bpmn">
  <bpmn:process id="Process_Katalis_Simulation" name="Simulasi Eksekusi Token KATALIS" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Order Diterima">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_Verifikasi" />
    <bpmn:task id="Activity_Verifikasi" name="Verifikasi Kelayakan Kebutuhan">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_Verifikasi" targetRef="Gateway_Split" />
    <bpmn:parallelGateway id="Gateway_Split" name="Paralelisasi Alur">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3a</bpmn:outgoing>
      <bpmn:outgoing>Flow_3b</bpmn:outgoing>
    </bpmn:parallelGateway>
    <bpmn:sequenceFlow id="Flow_3a" sourceRef="Gateway_Split" targetRef="Activity_AnalisisTeknis" />
    <bpmn:sequenceFlow id="Flow_3b" sourceRef="Gateway_Split" targetRef="Activity_ValidasiAnggaran" />
    <bpmn:task id="Activity_AnalisisTeknis" name="Analisis Arsitektur Teknis">
      <bpmn:incoming>Flow_3a</bpmn:incoming>
      <bpmn:outgoing>Flow_4a</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_ValidasiAnggaran" name="Validasi Anggaran dan Legal">
      <bpmn:incoming>Flow_3b</bpmn:incoming>
      <bpmn:outgoing>Flow_4b</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_4a" sourceRef="Activity_AnalisisTeknis" targetRef="Gateway_Join" />
    <bpmn:sequenceFlow id="Flow_4b" sourceRef="Activity_ValidasiAnggaran" targetRef="Gateway_Join" />
    <bpmn:parallelGateway id="Gateway_Join" name="Sinkronisasi Selesai">
      <bpmn:incoming>Flow_4a</bpmn:incoming>
      <bpmn:incoming>Flow_4b</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:parallelGateway>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Gateway_Join" targetRef="Gateway_Keputusan" />
    <bpmn:exclusiveGateway id="Gateway_Keputusan" name="Disetujui?">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_Yes</bpmn:outgoing>
      <bpmn:outgoing>Flow_No</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_Yes" name="Ya" sourceRef="Gateway_Keputusan" targetRef="Activity_Implementasi" />
    <bpmn:sequenceFlow id="Flow_No" name="Tidak" sourceRef="Gateway_Keputusan" targetRef="Activity_Revisi" />
    <bpmn:task id="Activity_Implementasi" name="Penerbitan Kontrak Kerja">
      <bpmn:incoming>Flow_Yes</bpmn:incoming>
      <bpmn:outgoing>Flow_End1</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_Revisi" name="Kirim Rekomendasi Revisi">
      <bpmn:incoming>Flow_No</bpmn:incoming>
      <bpmn:outgoing>Flow_End2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="Proyek Diluncurkan">
      <bpmn:incoming>Flow_End1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="EndEvent_2" name="Dokumen Diarsipkan">
      <bpmn:incoming>Flow_End2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_End1" sourceRef="Activity_Implementasi" targetRef="EndEvent_1" />
    <bpmn:sequenceFlow id="Flow_End2" sourceRef="Activity_Revisi" targetRef="EndEvent_2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_Katalis_Simulation">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="180" y="202" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="162" y="245" width="73" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Verifikasi_di" bpmnElement="Activity_Verifikasi">
        <dc:Bounds x="270" y="180" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_Split_di" bpmnElement="Gateway_Split">
        <dc:Bounds x="445" y="195" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="430" y="252" width="81" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_AnalisisTeknis_di" bpmnElement="Activity_AnalisisTeknis">
        <dc:Bounds x="550" y="100" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_ValidasiAnggaran_di" bpmnElement="Activity_ValidasiAnggaran">
        <dc:Bounds x="550" y="260" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_Join_di" bpmnElement="Gateway_Join">
        <dc:Bounds x="735" y="195" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="729" y="252" width="63" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_Keputusan_di" bpmnElement="Gateway_Keputusan" isMarkerVisible="true">
        <dc:Bounds x="845" y="195" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="847" y="171" width="47" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Implementasi_di" bpmnElement="Activity_Implementasi">
        <dc:Bounds x="950" y="110" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Revisi_di" bpmnElement="Activity_Revisi">
        <dc:Bounds x="950" y="260" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="1132" y="132" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1119" y="175" width="63" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_2_di" bpmnElement="EndEvent_2">
        <dc:Bounds x="1132" y="282" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1123" y="325" width="54" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="216" y="220" />
        <di:waypoint x="270" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="390" y="220" />
        <di:waypoint x="445" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3a_di" bpmnElement="Flow_3a">
        <di:waypoint x="470" y="195" />
        <di:waypoint x="470" y="140" />
        <di:waypoint x="550" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3b_di" bpmnElement="Flow_3b">
        <di:waypoint x="470" y="245" />
        <di:waypoint x="470" y="300" />
        <di:waypoint x="550" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4a_di" bpmnElement="Flow_4a">
        <di:waypoint x="670" y="140" />
        <di:waypoint x="760" y="140" />
        <di:waypoint x="760" y="195" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4b_di" bpmnElement="Flow_4b">
        <di:waypoint x="670" y="300" />
        <di:waypoint x="760" y="300" />
        <di:waypoint x="760" y="245" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="785" y="220" />
        <di:waypoint x="845" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Yes_di" bpmnElement="Flow_Yes">
        <di:waypoint x="870" y="195" />
        <di:waypoint x="870" y="150" />
        <di:waypoint x="950" y="150" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="878" y="163" width="14" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_No_di" bpmnElement="Flow_No">
        <di:waypoint x="870" y="245" />
        <di:waypoint x="870" y="300" />
        <di:waypoint x="950" y="300" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="871" y="273" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_End1_di" bpmnElement="Flow_End1">
        <di:waypoint x="1070" y="150" />
        <di:waypoint x="1132" y="150" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_End2_di" bpmnElement="Flow_End2">
        <di:waypoint x="1070" y="300" />
        <di:waypoint x="1132" y="300" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export const CLOSING_CUSTOMER_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_Closing_Customer" targetNamespace="http://katalis.mualnudarza.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_Closing">
    <bpmn:participant id="Participant_Sales" name="Alur End-to-End Closing Customer (KATALIS Business Template)" processRef="Process_Closing_Customer" />
  </bpmn:collaboration>
  <bpmn:process id="Process_Closing_Customer" isExecutable="true">
    <bpmn:laneSet id="LaneSet_Sales">
      <bpmn:lane id="Lane_AE" name="Account Executive">
        <bpmn:flowNodeRef>Start_Lead</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_Discovery</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_Proposal</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Gateway_Minat</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_Finance" name="Finance &amp; Legal">
        <bpmn:flowNodeRef>Task_Kontrak</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_Invoice</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>End_ClosedWon</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>End_ClosedLost</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:startEvent id="Start_Lead" name="Lead Masuk">
      <bpmn:outgoing>Flow_C1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_Discovery" name="Discovery Call &amp; Scoring">
      <bpmn:incoming>Flow_C1</bpmn:incoming>
      <bpmn:outgoing>Flow_C2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task_Proposal" name="Penyusunan Proposal &amp; Demo">
      <bpmn:incoming>Flow_C2</bpmn:incoming>
      <bpmn:outgoing>Flow_C3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway_Minat" name="Customer Sepakat?">
      <bpmn:incoming>Flow_C3</bpmn:incoming>
      <bpmn:outgoing>Flow_Deal</bpmn:outgoing>
      <bpmn:outgoing>Flow_Drop</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Task_Kontrak" name="Draft Kontrak &amp; NDA Legal">
      <bpmn:incoming>Flow_Deal</bpmn:incoming>
      <bpmn:outgoing>Flow_C4</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task_Invoice" name="Penerbitan Invoice Down Payment">
      <bpmn:incoming>Flow_C4</bpmn:incoming>
      <bpmn:outgoing>Flow_C5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="End_ClosedWon" name="Deal Closed Won">
      <bpmn:incoming>Flow_C5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="End_ClosedLost" name="Deal Closed Lost">
      <bpmn:incoming>Flow_Drop</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_C1" sourceRef="Start_Lead" targetRef="Task_Discovery" />
    <bpmn:sequenceFlow id="Flow_C2" sourceRef="Task_Discovery" targetRef="Task_Proposal" />
    <bpmn:sequenceFlow id="Flow_C3" sourceRef="Task_Proposal" targetRef="Gateway_Minat" />
    <bpmn:sequenceFlow id="Flow_Deal" name="Ya" sourceRef="Gateway_Minat" targetRef="Task_Kontrak" />
    <bpmn:sequenceFlow id="Flow_Drop" name="Tidak" sourceRef="Gateway_Minat" targetRef="End_ClosedLost" />
    <bpmn:sequenceFlow id="Flow_C4" sourceRef="Task_Kontrak" targetRef="Task_Invoice" />
    <bpmn:sequenceFlow id="Flow_C5" sourceRef="Task_Invoice" targetRef="End_ClosedWon" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Closing">
    <bpmndi:BPMNPlane id="BPMNPlane_Closing" bpmnElement="Collaboration_Closing">
      <bpmndi:BPMNShape id="Participant_Sales_di" bpmnElement="Participant_Sales" isHorizontal="true">
        <dc:Bounds x="160" y="80" width="880" height="380" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_AE_di" bpmnElement="Lane_AE" isHorizontal="true">
        <dc:Bounds x="190" y="80" width="850" height="190" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_Finance_di" bpmnElement="Lane_Finance" isHorizontal="true">
        <dc:Bounds x="190" y="270" width="850" height="190" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Start_Lead_di" bpmnElement="Start_Lead">
        <dc:Bounds x="232" y="152" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="221" y="195" width="59" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Discovery_di" bpmnElement="Task_Discovery">
        <dc:Bounds x="320" y="130" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Proposal_di" bpmnElement="Task_Proposal">
        <dc:Bounds x="480" y="130" width="130" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_Minat_di" bpmnElement="Gateway_Minat" isMarkerVisible="true">
        <dc:Bounds x="655" y="145" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="654" y="115" width="53" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Kontrak_di" bpmnElement="Task_Kontrak">
        <dc:Bounds x="620" y="320" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Invoice_di" bpmnElement="Task_Invoice">
        <dc:Bounds x="780" y="320" width="130" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_ClosedWon_di" bpmnElement="End_ClosedWon">
        <dc:Bounds x="952" y="342" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="928" y="385" width="85" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_ClosedLost_di" bpmnElement="End_ClosedLost">
        <dc:Bounds x="782" y="152" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="758" y="195" width="84" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_C1_di" bpmnElement="Flow_C1">
        <di:waypoint x="268" y="170" />
        <di:waypoint x="320" y="170" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_C2_di" bpmnElement="Flow_C2">
        <di:waypoint x="440" y="170" />
        <di:waypoint x="480" y="170" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_C3_di" bpmnElement="Flow_C3">
        <di:waypoint x="610" y="170" />
        <di:waypoint x="655" y="170" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Deal_di" bpmnElement="Flow_Deal">
        <di:waypoint x="680" y="195" />
        <di:waypoint x="680" y="320" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="688" y="248" width="14" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Drop_di" bpmnElement="Flow_Drop">
        <di:waypoint x="705" y="170" />
        <di:waypoint x="782" y="170" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="730" y="152" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_C4_di" bpmnElement="Flow_C4">
        <di:waypoint x="740" y="360" />
        <di:waypoint x="780" y="360" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_C5_di" bpmnElement="Flow_C5">
        <di:waypoint x="910" y="360" />
        <di:waypoint x="952" y="360" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export const BLANK_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_Blank" targetNamespace="http://katalis.mualnudarza.io/schema/bpmn">
  <bpmn:process id="Process_Blank" name="Diagram Baru KATALIS" isExecutable="true">
    <bpmn:startEvent id="StartEvent_Blank" name="Mulai">
      <bpmn:outgoing>Flow_Blank_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_Blank_1" name="Langkah Proses Pertama">
      <bpmn:incoming>Flow_Blank_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Blank_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_Blank_1" sourceRef="StartEvent_Blank" targetRef="Activity_Blank_1" />
    <bpmn:endEvent id="EndEvent_Blank" name="Selesai">
      <bpmn:incoming>Flow_Blank_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_Blank_2" sourceRef="Activity_Blank_1" targetRef="EndEvent_Blank" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Blank">
    <bpmndi:BPMNPlane id="BPMNPlane_Blank" bpmnElement="Process_Blank">
      <bpmndi:BPMNShape id="StartEvent_Blank_di" bpmnElement="StartEvent_Blank">
        <dc:Bounds x="182" y="162" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="187" y="205" width="27" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Blank_1_di" bpmnElement="Activity_Blank_1">
        <dc:Bounds x="280" y="140" width="140" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Blank_di" bpmnElement="EndEvent_Blank">
        <dc:Bounds x="482" y="162" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="482" y="205" width="37" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_Blank_1_di" bpmnElement="Flow_Blank_1">
        <di:waypoint x="218" y="180" />
        <di:waypoint x="280" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Blank_2_di" bpmnElement="Flow_Blank_2">
        <di:waypoint x="420" y="180" />
        <di:waypoint x="482" y="180" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
