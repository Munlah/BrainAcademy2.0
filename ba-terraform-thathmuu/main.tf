terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "dvopsBrainAcademy" {
  name     = "dvopsBrainAcademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "dvopsAKSCluster" {
  name                = "dvopsAKSCluster"
  location            = azurerm_resource_group.dvopsBrainAcademy.location
  resource_group_name = azurerm_resource_group.dvopsBrainAcademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "3906a912-dbdb-41dc-b49b-ae73a69fa660"
    client_secret = "Nmj8Q~CRdRD4aCd9KANvtzVgyOWhD9LH2uNrIbvY"
  }
}